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
        method: 'GET',
        path: '/threads/{threadId}',
        handler: handler.getThreadDetailHandler,
    },
    {
        method: 'POST',
        path: '/threads/{threadId}/comments',
        handler: handler.addCommentHandler,
        options: {
            auth: 'forumapi_jwt',
        }
    },
    {
        method: 'DELETE',
        path: '/threads/{threadId}/comments/{commentId}',
        handler: handler.deleteCommentHandler,
        options: {
            auth: 'forumapi_jwt',
        }
    }
]);

module.exports = routes;