module.exports = {
    apps: [
        {
            name: 'urbor_expert_app',
            script: 'npm',
            reverse_proxy: {
                enabled: true,
                port: 3040,
                domain: 'urborexpert.pclean.app',
            },
        },
    ],
};

