// Imports
const AWS = require('aws-sdk')

AWS.config.update({ region: 'us-east-1' })

// Declare local variables
const cw = new AWS.CloudWatch()
const alarmName = 'hamster-elb-alarm'
const topicArn = 'arn:aws:sns:us-east-1:003344954302:hamster-topic'
const tg = 'targetgroup/hamsterTG/28b2348a0ca1541e'
const lb = 'app/hamsterELB/70898a214a0683db'

createCloudWatchAlarm(alarmName, topicArn, tg, lb)
.then(data => console.log(data))

function createCloudWatchAlarm (alarmName, topicArn, tg, lb) {
  const params = {
    AlarmName: alarmName,
    Period: 60,
    Threshold: 1,
    Namespace: 'AWS/ApplicationELB',
    EvaluationPeriods: 1,
    ComparisonOperator: 'LessThanThreshold',
    MetricName: 'HealthyHostCount',
    AlarmActions: [
      topicArn
    ],
    Dimensions: [
      {
        Name: 'TargetGroup',
        Value: tg
      },
      {
        Name: 'LoadBalancer',
        Value: lb
      }
    ],
    Statistic: 'Average',
    TreatMissingData: 'breaching'
  }

  return new Promise((resolve, reject) => {
    cw.putMetricAlarm(params, (err, data)=>{
      if(err) reject(err)
      else resolve(data)
    })
  })
}
