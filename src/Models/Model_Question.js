export default function Model_Questions(param) {
    const {
        question,
        replies
    } = param;

    question.replies = replies || [];

    question.addReply = (reply) => {
        question.replies.push(reply);
    }
    
    return question;
}
