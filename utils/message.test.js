let expect = require('expect');

let{generateMessage} = require('./message');

describe('Generate Message', () => {
    it("should generate correct message object", () => {
        let from = "User-001";
        let text = "Random Text";
        let message = generateMessage(from, text);
    
        expect(typeof message.createdAt).toBe('number');
        expect(message).toMatchObject((from, text));
    });
});