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
    },
    {
        method: 'POST',
        path: '/threads/{threadId}/comments/{commentId}/replies',
        handler: handler.addReplyHandler,
        options: {
            auth: 'forumapi_jwt',
        }
    },
    {
        method: 'DELETE',
        path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
        handler: handler.deleteReplyHandler,
        options: {
            auth: 'forumapi_jwt',
        }
    }
]);

module.exports = routes;