#! /usr/bin/env node

//influx dbname is "tooltests"
const fs = require('fs');

// const in_file_name = "data/org/1/htmlreports/usegalaxy_2eorg_20tool_20tests/tool_test_output.json"
const out_file_name = "import.lineprot"

const folder_mapping = {
    "org": "usegalaxy_2eorg_20tool_20tests",
    "eu": "usegalaxy_2eeu_20tool_20tests",
    "org.au": "Galaxy_20Australia_20tool_20tests",
    "test": "test_2eusegalaxy_2eorg_20tool_20tests",
}
const suite_execution = {
    "org": {
        "1": 1556209468261,
        "4": 1556551003149,
        "5": 1556611342933,
        "6": 1556706831166,
        "7": 1556707942454,
        "8": 1556709516874,
        "9": 1556709761017,
        "18": 1560327214591,
        "20": 1560440828383,
        "21": 1560478861948,
    },
    "eu": {
        "2": 1556201408951,
        "3": 1557849426040,
        "8": 1560885852656,
    },
    "org.au": {
        "1": 1558170448113,
        "3": 1560193499371,
        "5": 1560457787388,
        "6": 1560880410317,
    },
    "test": {
        "4": 1556109598044,
        "5": 1556110047736,
        "6": 1556110244377,
        "8": 1556110511929,
        "9": 1556110641692,
        "10": 1556111197060,
        "11": 1556111479741,
        "15": 1556807667639,
        "16": 1557418459831,
        "18": 1560195104186,
        "20": 1560461151063,
        "21": 1560892274043,
    }
}

fs.writeFileSync(out_file_name, "");
for (const [server, builds] of Object.entries(suite_execution)) {
    const mapping = folder_mapping[server];
    for (const [build_number, timestamp] of Object.entries(builds)) {
        const path = `data/${server}/${build_number}/htmlreports/${mapping}/tool_test_output.json`;
        const tool_test_output = JSON.parse(fs.readFileSync(path));
        for (const test of tool_test_output.tests){
            const success = test.data.status == "success" ? 1 : 0;
            const tool_id = test.data.tool_id.replace(/ /g, "_");
            const time_seconds = Math.round(test.data.time_seconds)
            const dash_split = test.id.split("-");
            const test_no = dash_split[dash_split.length - 1];
            const slash_split = test.data.tool_id.split("/");
            const owner = slash_split[2];
            const repo = slash_split[3];
            const test_lineprot = `tooltest,owner=${owner},repo=${repo},server=${server},tool_id=${tool_id},test_no=${test_no} time_seconds=${time_seconds},success=${success} ${timestamp}\n`
            fs.appendFileSync(out_file_name, test_lineprot);
        }
    }
}
