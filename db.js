const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid'); // npm package to generate UUIDs

// Set up AWS credentials
AWS.config.update({
    region: 'us-east-1',
    accessKeyId: 'AKIAU4UIZ5DHMUSZHELA',
    secretAccessKey: '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'
});

// Create a new DynamoDB instance
const dynamodb = new AWS.DynamoDB();

// Get the name of the DynamoDB table to use
const tableName = 'ToDoListApp';

// Function to add a new item to the to-do list
function addItem(item) {
    // Generate a unique ID for the new item
    const itemId = uuidv4();
    // Set up the parameters for the DynamoDB put operation
    const params = {
        TableName: tableName,
        Item: {
            itemId: { S: itemId },
            item: { S: item }
        }
    };
    console.log(params);

    // Call the DynamoDB put operation to add the new item
    dynamodb.putItem(params, (err, data) => {
        if (err) {
            console.error('Unable to add item:', err);
        } else {
            console.log('Item added to table:', data);
        }
    });
}

// Function to get all items from the to-do list
function getAllItems() {
    // Set up the parameters for the DynamoDB scan operation
    const params = {
        TableName: tableName
    };

    // Call the DynamoDB scan operation to get all items
    dynamodb.scan(params, (err, data) => {
        if (err) {
            console.error('Unable to get items:', err);
        } else {
            // Map the DynamoDB item format to an array of JavaScript objects
            const items = data.Items.map(item => {
                return {
                    id: item.id.S,
                    text: item.text.S
                };
            });

            // Render the to-do list using the items array
            renderList(items);
        }
    });
}


module.exports.addItem = addItem;
// Get all items from the to-do list when the page loads
//getAllItems();
