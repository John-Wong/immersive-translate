#!/bin/bash

cd dist/thunderbird
MENU_API_FILES=("background.js" "options.js")
BG_FILE="background.js"
MANIFEST_FILE="manifest.json"

echo "--- Part 1: Modify parameters and permissions declarations for specific APIs ---"
OLD_PARAMS='contextMenus:{remove:{minArgs:1,maxArgs:1},removeAll:{minArgs:0,maxArgs:0},update:{minArgs:2,maxArgs:2}},'
NEW_PARAMS=',menus:{remove:{minArgs:1,maxArgs:1},removeAll:{minArgs:0,maxArgs:0},update:{minArgs:2,maxArgs:2}},messageDisplayScripts:{register:{minArgs:1,maxArgs:1}}'
OLD_PERMISSION='"contextMenus"'
NEW_PERMISSION='"menus","messagesModify"'

for file in *".js"; do
    if [ -f "$file" ]; then
        echo "Processing file: $file"
        sed -i.bak "s#${OLD_PARAMS}##g" "$file"
        sed -i.bak "s#,notifications#${NEW_PARAMS},notifications#g" "$file"
        sed -i.bak "s#${OLD_PERMISSION}#${NEW_PERMISSION}#g" "$file"
        rm "${file}.bak"
    fi
done
echo "--- Part 1 processing completed ---"
echo

echo "--- Part 2: Modify the calling name of menu APIs ---"
for file in "${MENU_API_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "Processing file: $file"
        sed -i.bak "s#\bcontextMenus\b#menus#g" "$file"
        rm "${file}.bak"
    else
        echo "Warning: File $file does not exist!"
    fi
done
echo "--- Part 2 processing completed ---"
echo

echo "--- Part 3: Add scripts registering function and remove page_action ---"
if [ -f ${BG_FILE} ]; then
    echo "Processing file: ${BG_FILE}"
    sed -i.bak 's#\["browser_action","page_action"\]#\["browser_action"\]#g' "${BG_FILE}"

    REG_FUNC='async function regMsgDisplayScripts(){await messenger.messageDisplayScripts.register({js:[{file:"/content_script.js"},{file:"/content_start.js"}]});}regMsgDisplayScripts();'
    INSERT_LOC='=>{});})();'
    sed -i.bak "s#${INSERT_LOC}#=>{});${REG_FUNC}})();#g" "${BG_FILE}"
    rm "${BG_FILE}.bak"
else
    echo "Warning: File $BG_FILE does not exist!"
fi
echo "--- Part 3 processing completed ---"
echo

echo "--- Part 4: Modify manifest.json ---"
if [ -f "$MANIFEST_FILE" ]; then
    echo "Processing file: $MANIFEST_FILE"
    sed -i.bak 's#"contextMenus",#"menus",\
    "messagesModify",#g' "$MANIFEST_FILE"

    perl -i.bak -0777 -pe 's/"63\.0"\s*},\s*"gecko_android":\s*{\s*"strict_min_version":\s*"113\.0"\s*}/"78.0"\n    }/g' "$MANIFEST_FILE"
    rm "${MANIFEST_FILE}.bak"
else
    echo "Warning: File $MANIFEST_FILE does not exist!"
fi
echo "--- Part 4 processing completed ---"
echo

echo "All done."