const routes = (handler) => ([
    {
        method: 'POST',
        path: '/threads',
        handler: handler.postThreadHandler,
        options: {
            auth: 'forumapi_jwt',
        }
    },
    {
        method: 'POST',
        path: '/threads/{threadId}/comments',
        handler: handler.addCommentHandler,
        options: {
            auth: 'forumapi_jwt',
        }
    }
]);

module.exports = routes;