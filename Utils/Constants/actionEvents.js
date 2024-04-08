import { KeyboardButtonList, IfType, ConditionList, ConvertList, WaitUntil, RandomType } from "./actionEventOptions.js";

export const actionEvents = [
    {
        name: "Launch Website",
        object: false,
        testParameters: [{ name: "URL" }],
    },
    {
        name: "Click",
        object: true,
        testParameters: [{ name: "Timeout", defaultValue: "1000" }],
    },
    {
        name: "Double Click",
        object: true,
        testParameters: [{ name: "Timeout", defaultValue: "1000" }],
    },
    {
        name: "Right Click",
        object: true,
        testParameters: [{ name: "Timeout", defaultValue: "1000" }],
    },
    {
        name: "Enter Text",
        object: true,
        testParameters: [{ name: "Text" }, { name: "Timeout", defaultValue: "1000" }],
    },
    {
        name: "Enter Date Time",
        object: true,
        testParameters: [{ name: "DateTime" }, { name: "Format" }],
    },
    {
        name: "Clear Input",
        object: true,
        testParameters: [{ name: "Timeout", defaultValue: "1000" }],
    },
    {
        name: "Press Button",
        object: true,
        testParameters: [
            {
                name: "Button",
                options: KeyboardButtonList,
            },
        ],
    },
    {
        name: "Maximize Browser",
        object: false,
        testParameters: [],
    },
    {
        name: "Switch To Tab",
        object: false,
        testParameters: [{ name: "TabNumber" }],
    },
    {
        name: "Switch To Default Tab",
        object: false,
        testParameters: [],
    },
    {
        name: "Close Browser",
        object: false,
        testParameters: [],
    },
    {
        name: "Wait",
        object: false,
        testParameters: [{ name: "Time" }],
    },
    {
        name: "Wait Until",
        object: true,
        testParameters: [
            { name: "WaitType", options: WaitUntil },
            { name: "Timeout", defaultValue: "1000" },
        ],
    },
    {
        name: "Accept Alert",
        object: false,
        testParameters: [],
    },
    {
        name: "Dismiss Alert",
        object: false,
        testParameters: [],
    },
    {
        name: "Get Alert Message",
        object: false,
        testParameters: [{ name: "Output" }],
    },
    {
        name: "Enter Text In Alert",
        object: false,
        testParameters: [{ name: "Text" }],
    },
    {
        name: "Refresh Page",
        object: false,
        testParameters: [],
    },
    {
        name: "Back Page",
        object: false,
        testParameters: [],
    },
    {
        name: "Forward Page",
        object: false,
        testParameters: [],
    },
    {
        name: "New Tab",
        object: false,
        testParameters: [],
    },
    {
        name: "New Window",
        object: false,
        testParameters: [],
    },
    {
        name: "Generate Random Number",
        object: false,
        testParameters: [{ name: "Min" }, { name: "Max" }, { name: "Decimal" }, { name: "Output" }],
    },
    {
        name: "Generate Random String",
        object: false,
        testParameters: [{ name: "Characters" }, { name: "Length" }, { name: "Output" }],
    },
    {
        name: "Get Page Title",
        object: false,
        testParameters: [{ name: "Output" }],
    },
    {
        name: "Get Page URL",
        object: false,
        testParameters: [{ name: "Output" }],
    },
    {
        name: "Console Log",
        object: false,
        testParameters: [{ name: "Value" }],
    },
    {
        name: "Scroll To Object",
        object: true,
        testParameters: [],
    },
    {
        name: "Scroll To End",
        object: false,
        testParameters: [],
    },
    {
        name: "Scroll To Top",
        object: false,
        testParameters: [],
    },
    {
        name: "Click By Javascript",
        object: true,
        testParameters: [{ name: "Timeout", defaultValue: "1000" }],
    },
    {
        name: "Click Link By Text",
        object: false,
        testParameters: [{ name: "Text" }, { name: "Timeout", defaultValue: "1000" }],
    },
    {
        name: "Click Link By Partial Text",
        object: false,
        testParameters: [{ name: "Text" }, { name: "Timeout", defaultValue: "1000" }],
    },
    {
        name: "Hover Mouse",
        object: true,
        testParameters: [],
    },
    {
        name: "Copy Text",
        object: false,
        testParameters: [{ name: "Text" }, { name: "Output" }],
    },
    {
        name: "Copy Substring",
        object: false,
        testParameters: [{ name: "Value" }, { name: "StartIndex" }, { name: "EndIndex" }, { name: "Output" }],
    },
    {
        name: "Combine String",
        object: false,
        testParameters: [{ name: "Value1" }, { name: "Value2" }, { name: "Value3" }, { name: "Output" }],
    },
    {
        name: "Get Current Date Time",
        object: false,
        testParameters: [{ name: "Output" }],
    },
    {
        name: "If",
        object: false,
        testParameters: [{ name: "Value1" }, { name: "Condition", options: ConditionList }, { name: "Value2" }, { name: "IfType", options: IfType }],
    },
    {
        name: "Else If",
        object: false,
        testParameters: [{ name: "Value1" }, { name: "Condition", options: ConditionList }, { name: "Value2" }, { name: "IfType", options: IfType }],
    },
    {
        name: "If Object Selected",
        object: true,
        testParameters: [],
    },
    {
        name: "Else",
        object: false,
        testParameters: [],
    },
    {
        name: "End Condition",
        object: false,
        testParameters: [],
    },
    {
        name: "Collect Object Text",
        object: true,
        testParameters: [{ name: "Output" }],
    },
    {
        name: "Collect Object CSS Property",
        object: true,
        testParameters: [{ name: "Attribute" }, { name: "Output" }],
    },
    {
        name: "Collect Object Property",
        object: true,
        testParameters: [{ name: "Attribute" }, { name: "Output" }],
    },
    {
        name: "Convert To",
        object: false,
        testParameters: [{ name: "ConvertType", options: ConvertList }, { name: "Value" }, { name: "Output" }],
    },
    {
        name: "Select Option By Value",
        object: true,
        testParameters: [{ name: "Value" }],
    },
    {
        name: "Select Option By Position",
        object: true,
        testParameters: [{ name: "Position" }, { name: "Element" }],
    },
    {
        name: "Switch To Frame",
        object: true,
        testParameters: [],
    },
    {
        name: "Switch To Default Frame",
        object: false,
        testParameters: [],
    },
    {
        name: "Collect Cell Value From Table",
        object: true,
        testParameters: [{ name: "Row" }, { name: "Column" }, { name: "Output" }],
    },
    {
        name: "Get Date Time",
        object: false,
        testParameters: [{ name: "RowDateTime" }, { name: "Output" }],
    },
    {
        name: "Add Date Time",
        object: false,
        testParameters: [{ name: "DateTime" }, { name: "Day Month Year" }, { name: "Hour Min Sec" }, { name: "Output" }],
    },
    {
        name: "Subtract Date Time",
        object: false,
        testParameters: [{ name: "DateTime" }, { name: "Day Month Year" }, { name: "Hour Min Sec" }, { name: "Output" }],
    },
    {
        name: "If Object Visible",
        object: true,
        testParameters: [],
    },
    {
        name: "Calculate And Store",
        object: false,
        testParameters: [{ name: "Value1" }, { name: "Value2" }, { name: "Operand" }, { name: "Output" }],
    },
    {
        name: "Throw Error",
        object: false,
        testParameters: [{ name: "Messsage" }],
    },
    {
        name: "Store For Loop Variable",
        object: false,
        testParameters: [{ name: "Output" }],
    },
    {
        name: "Change Dynamic Value",
        object: false,
        testParameters: [{ name: "DynamicKey" }, { name: "NewValue" }],
    },
    {
        name: "End For Loop",
        object: false,
        testParameters: [],
    },
    {
        name: "For Loop",
        object: false,
        testParameters: [{ name: "Initial" }, { name: "Final" }, { name: "Counter" }],
    },
    {
        name: "Break For Loop",
        object: false,
        testParameters: [],
    },
    {
        name: "Skip For Loop Iteration",
        object: false,
        testParameters: [],
    },
    {
        name: "Custom JS Action",
        object: false,
        testParameters: [{ name: "Code" }, { name: "Output" }],
    },
    {
        name: "API",
        object: false,
        testParameters: [{ name: "URL" }, { name: "ApiData" }, { name: "Output" }],
    },
    {
        name: "Generate Random Details",
        object: false,
        testParameters: [{ name: "RandomType", options: RandomType }, { name: "Count" }, { name: "Output" }],
    },
    {
        name: "Wait For Network Calls",
        object: false,
        testParameters: [{ name: "Count" }, { name: "Timeout", defaultValue: "1000" }],
    },
];
