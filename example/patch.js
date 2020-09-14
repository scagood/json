const patch = require('./patch.js');

const object = {
    biscuits: [
        { name: 'Digestive' },
        { name: 'Choco Leibniz' },
    ],
};

const output = patch(object, [
    {
        op: 'add',
        path: '/biscuits/-',
        value: { name: 'Ginger Bread' },
    },
    {
        op: 'replace',
        path: '/biscuits/-/name',
        value: 'Ginger Nut',
    },
    {
        op: 'add',
        path: '/biscuits/[/name == "Digestive"]',
        value: { name: 'Chocolate ship' },
    },
    {
        op: 'remove',
        path: '/biscuits/[/name == "Choco Leibniz"]',
    },
    {
        op: 'replace',
        path: '/biscuits/[/name == "Chocolate ship"]/name',
        value: 'Chocolate Chip',
    },
    {
        op: 'copy',
        path: '/best',
        from: '/biscuits/[/name == "Chocolate Chip"]',
    },
    {
        op: 'remove',
        path: '/biscuits/[/name == "Chocolate Chip"]',
    },
    {
        op: 'move',
        path: '/worst',
        from: '/biscuits/[/name == "Ginger Nut"]',
    },
    {
        op: 'move',
        path: '/others',
        from: '/biscuits',
    },
    {
        op: 'test',
        path: '/best/name',
        value: 'Chocolate Chip',
    },
]);

console.info(JSON.stringify({ before: object, after: output }, null, 2));
