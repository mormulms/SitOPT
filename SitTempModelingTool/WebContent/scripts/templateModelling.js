function makeDraggable(dragObj) {


    var ext = 0;
    var dragObjId = dragObj.attr("id");

    var commonSrc = {
        isSource:true,
        maxConnections:-1,
        connector: ["Straight"]
    };
    var commonTar = {
        isTarget:true,
        maxConnections:-1,
        connector: ["Straight"]
    };

    jsPlumb.ready(function() {
        // ContextCondition Node is only Source
        if (dragObj.hasClass("nodeTemplateContext")) {
            jsPlumb.addEndpoint(dragObjId,
                {
                    anchor:"Top",
                    uuid: dragObjId
                }, commonSrc);
        };
        // Condition Node is Source and Target
        if (dragObj.hasClass("nodeTemplateCondition")) {
            jsPlumb.addEndpoint(dragObjId,
                {
                    anchor:"Top",
                    uuid: dragObjId + "_top"
                }, commonSrc);
            jsPlumb.addEndpoint(dragObjId,
                {
                    anchor:"Bottom",
                    uuid: dragObjId,
                    connectionsDetachable: true
                }, commonTar);
        };
        // Operation Node is both Source and Target
        if (dragObj.hasClass("nodeTemplateOperation")) {
            jsPlumb.addEndpoint(dragObjId, {
                anchor:"Top",
                uuid: dragObjId + "_top"
            }, commonSrc);
            jsPlumb.addEndpoint(dragObjId, {
                anchor:"Bottom",
                uuid: dragObjId,
                connectionsDetachable:true
            }, commonTar);
        };
        // Situation Node is only Target
        if (dragObj.hasClass("nodeTemplateSituation")) {
            jsPlumb.addEndpoint(dragObjId, {
                anchor:"Bottom",
                uuid: dragObjId,
                connectionsDetachable:true
            }, commonTar);
        };
        jsPlumb.draggable(dragObjId);
    });
}