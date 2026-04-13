const { EC2Client, DescribeInstancesCommand, StopInstancesCommand } = require("@aws-sdk/client-ec2");

const client = new EC2Client({ region: process.env.AWS_REGION || "us-east-1" });

module.exports.handler = async (event) => {
  console.log("Starting EC2 Auto Stop Scheduler");

  try {
    // Look for instances with the tag "AutoStop=true" and state "running"
    const describeParams = {
      Filters: [
        {
          Name: "tag:AutoStop",
          Values: ["true", "True", "TRUE"],
        },
        {
          Name: "instance-state-name",
          Values: ["running"],
        },
      ],
    };

    const data = await client.send(new DescribeInstancesCommand(describeParams));
    
    let instancesToStop = [];

    data.Reservations.forEach((reservation) => {
      reservation.Instances.forEach((instance) => {
        instancesToStop.push(instance.InstanceId);
      });
    });

    if (instancesToStop.length === 0) {
      console.log("No running instances found with tag AutoStop=true");
      return;
    }

    console.log(`Stopping instances: ${instancesToStop.join(", ")}`);

    const stopParams = {
      InstanceIds: instancesToStop,
    };

    await client.send(new StopInstancesCommand(stopParams));
    console.log("Successfully stopped instances.");

  } catch (err) {
    console.error("Error shutting down instances:", err);
    throw err;
  }
};
