var config = {};

//Firebase cloud message server key
config.FCMServerKey = 'AAAAFaQMFOM:APA91bFR3I1IxRx0hUzjR0EMGmyl8NScv-YhFd8acmneiPMrBXZTCOsptDBM4NucGmRj7jOOCrkxo0dZ8E2x7uKW3wvUSfJcM5q9AEn41M9A_4gvtlwXRCElPcY5-jCipt1BiGjSY0Q9';

config.Port = 3001;

//Notification Server requests
config.AID_REQUEST_ORDER_SELF_PICKUP = 'AID_REQUEST_ORDER_SELF_PICKUP';
config.SITE_CONFIRM_ORDER_SELF_PICKUP = 'SITE_CONFIRM_ORDER_SELF_PICKUP';
config.AID_REQUEST_ORDER_SHIPMENT = 'AID_REQUEST_ORDER_SHIPMENT';
config.SITE_CONFIRM_ORDER_SHIPMENT = 'SITE_CONFIRM_ORDER_SHIPMENT';
config.SITE_SELFPICKUP_COMPLETE = 'SITE_SELFPICKUP_COMPLETE';
config.SITE_SHIPMENTPICKUP_COMPLETE = 'SITE_SHIPMENTPICKUP_COMPLETE';

//Notification server messages
config.AID_REQUEST_ORDER_SELF_PICKUP_MSG = 'You have Order, that is interested by MSRO user, Wants to self pickup';
config.SITE_CONFIRM_ORDER_SELF_PICKUP_MSG = 'Your order request is confirmed for self pickup. Self pickup slots and locations are available in MAP';
config.AID_REQUEST_ORDER_SHIPMENT_MSG = 'You have Request for shipment on the Post advertised';
config.SITE_CONFIRM_ORDER_SHIPMENT_MSG = 'Tracking# {tracking#} is requested for Shipment. Your shipment is chosen for REGULAR_PICKUP for FEDEX GROUND service type.';
config.SITE_SELFPICKUP_COMPLETE_MSG = 'Self pickup for is completed. You can see your completed orders in navigation menu';
config.SITE_SHIPMENTPICKUP_COMPLETE_MSG = 'Shipment pickup is completed, your oder will be delivered as per shipment transaction, Tracking order is #';

//Fedex API constant keys
config.FEDEX_ENVIRONMENT = 'sandbox'; //live
config.KEY = 'vMnClYS3N8zzhnwx';
config.PASSWORD = 'UPnHjZUYZp8e85g5UA50vGbQq';
config.ACCOUNT_NUMBER = '510087780';
config.METER_NUMBER = '118870275';

//UPS Account Number and UPS details
config.UPS_ENVIRONMENT = 'sandbox';
config.UPS_USERNAME = 'netsandip';
config.UPS_PASSWORD = 'Ustglobal@123';
config.ACCESS_KEY = '7D33218B0903B7EC';


module.exports = config;