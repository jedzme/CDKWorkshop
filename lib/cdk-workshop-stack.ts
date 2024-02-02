import { Duration, Stack, StackProps } from 'aws-cdk-lib';
// import * as sns from 'aws-cdk-lib/aws-sns';
// import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { HitCounter } from './hitcounter';
import { Construct } from 'constructs';
import { TableViewer } from 'cdk-dynamo-table-viewer';

export class CdkWorkshopStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    const hello = new lambda.Function(this, 'HelloFunction', {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'hello.handler'
    });
    
    const helloWithCounter = new HitCounter(this, 'HelloHitCounter', {
      downstream: hello
    });
    
    const api = new apigw.LambdaRestApi(this, 'WorkshopEndpoint', {
      handler: helloWithCounter.handler
    });
    
    new TableViewer(this, 'ViewHitCounter', {
      title: 'Hello Hits',
      table: helloWithCounter.table,
      sortBy: '-hits'
    });

    // const queue = new sqs.Queue(this, 'CdkWorkshopQueue', {
    //   visibilityTimeout: Duration.seconds(300)
    // });

    // const topic = new sns.Topic(this, 'CdkWorkshopTopic');

    // topic.addSubscription(new subs.SqsSubscription(queue));
  }
}
