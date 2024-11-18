const fs = require('fs');
const SocksClient = require('socks').SocksClient;

let validProxies = [];

// Função para carregar proxies do arquivo
function loadProxiesFromFile(filename) {
    try {
        const data = fs.readFileSync(filename, 'utf-8');
        return data.split('\n').map(proxy => proxy.trim()).filter(proxy => proxy);
    } catch (err) {
        console.error(`Erro ao carregar o arquivo ${filename}:`, err.message);
        return [];
    }
}

// Função para testar uma única proxy
async function testProxy(proxy) {
    const [proxyHost, proxyPort] = proxy.split(':');
    try {
        await SocksClient.createConnection({
            proxy: {
                host: proxyHost,
                port: parseInt(proxyPort),
                type: 4,
            },
            command: 'connect',
            destination: {
                host: 'example.com',
                port: 80,
            },
        });
        validProxies.push(proxy); // Proxy é válida
        console.log(`Proxy válida: ${proxy}`);
    } catch (err) {
        console.log(`Proxy inválida: ${proxy}`);
    }
}

// Função para validar todas as proxies
async function validateProxies(proxyList) {
    await Promise.all(proxyList.map(testProxy));
    console.log(`Proxies válidas: ${validProxies.length}`);
    return validProxies;
}

// Carregar proxies do arquivo e validar
(async () => {
    const proxyList = loadProxiesFromFile('socks4.txt');
    if (proxyList.length === 0) {
        console.error('Nenhuma proxy encontrada no arquivo.');
        return;
    }

    console.log(`Proxies carregadas: ${proxyList.length}`);
    const validProxies = await validateProxies(proxyList);
    console.log('Proxies válidas:', validProxies);
})();
