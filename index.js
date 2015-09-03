'use strict';

var SEP = "#";

function isJson(data) {
    return !(data instanceof Buffer);
}

function on_data(socket, data) {
    if(!(data instanceof Buffer)) {
        // json_event bound on 'data', exit the inception
        return;
    }
    socket.json_inbuf = (socket.json_inbuf || "") + data.toString();
    try {
        while(socket.json_inbuf.length) {
            data = socket.json_inbuf;
            var sep = data.indexOf(SEP);
            if(sep > 0) {
                var len = parseInt(data.slice(0, sep));
                data = data.slice(sep+1, sep+len+1);
                if(data.length !== len) {
                    // not enough data
                    return;
                }
                socket.json_inbuf = socket.json_inbuf.slice(sep+len+1);
                data = JSON.parse(data);
                socket.emit(socket.json_event, data);
                continue;
            } else if(sep < 0 && data.length < 10) {
                // sep not found, not enough data
                // 1e10 characters seems overly reasonable
                return;
            }
            throw new Error('Protocol Error');
        }
    } catch(e) {
        socket.emit('error', e);
    }
};

function decorate_socket(socket, json_event) {
    if(socket.isJsonSocket) {
        return socket;
    }
    socket.on('data', on_data.bind(null, socket));

    socket.json_event = json_event || 'data';

    var write = socket.write;
    socket.write = function() {
        var args = [].slice.call(arguments);
        var data = JSON.stringify(args[0]);
        var msg = data.length + SEP + data;
        args[0] = msg;
        write.apply(socket, args);
    };
    socket.isJsonSocket = true;
    return socket;
}

decorate_socket.isJson = isJson;
module.exports = decorate_socket;
