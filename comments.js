// Create web server
// 1. Load modules
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

// 2. Create web server
var server = http.createServer(function(request, response) {
    var parsedUrl = url.parse(request.url);
    var resource = parsedUrl.pathname;
    var method = request.method;

    if (resource == '/comments' && method == 'GET') {
        var query = parsedUrl.query;
        var commentId = qs.parse(query).id;

        if (commentId == undefined) {
            // 1. Read all comments from the file
            fs.readFile('./data/comments.json', 'utf-8', function(err, data) {
                if (err) {
                    response.statusCode = 500;
                    response.end('Server Internal Error');
                } else {
                    response.statusCode = 200;
                    response.setHeader('Content-Type', 'application/json;charset=utf-8');
                    response.end(data);
                }
            });
        } else {
            // 2. Read a specific comment from the file
            readComment(commentId, function(err, comment) {
                if (err) {
                    response.statusCode = 500;
                    response.end('Server Internal Error');
                } else {
                    response.statusCode = 200;
                    response.setHeader('Content-Type', 'application/json;charset=utf-8');
                    response.end(JSON.stringify(comment));
                }
            });
        }
    } else if (resource == '/comments' && method == 'POST') {
        // 1. Read the comment from the request body
        var body = '';
        request.on('data', function(chunk) {
            body += chunk;
        });
        request.on('end', function() {
            var comment = JSON.parse(body);
            // 2. Add the comment to the file
            addComment(comment, function(err) {
                if (err) {
                    response.statusCode = 500;
                    response.end('Server Internal Error');
                } else {
                    response.statusCode = 200;
                    response.end('OK');
                }
            });
        });
    } else if (resource == '/comments' && method == 'PUT') {
        // 1. Read the comment from the request body
        var body = '';
        request.on('data', function(chunk) {
            body += chunk;
        });
        request.on('end', function() {
            var comment = JSON
                .parse(body);
            // 2. Modify the comment in the file
            modifyComment(comment, function(err) {
                if (err) {
                    response.statusCode = 500;
                    response.end('Server Internal Error');
                } else {
                    response.statusCode = 200;
                    response.end('OK');
                }
            }
            );
        }
        );
    } else if (resource == '/comments' && method == 'DELETE') {
        // 1. Read the comment from the request body
        var body = '';
        request.on('data', function(chunk) {
            body += chunk;
        });
        request.on('end', function() {
            var comment = JSON.parse(body);
            // 2. Delete the comment from the file
            deleteComment(comment, function(err) {
                if (err) {
                    response.statusCode = 500;
                    response.end('Server Internal Error');
                } else {
                    response.statusCode = 200;
                    response.end('OK');
                }
            });
        });
    }
    else {
        response.statusCode = 404;
        response.end('Not Found');
    }
});