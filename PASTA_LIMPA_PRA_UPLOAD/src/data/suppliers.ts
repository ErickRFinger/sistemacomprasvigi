export interface Supplier {
    id: string;
    name: string;
    phone: string;
    product: string;
    city: string;
    region: string;
    products?: string[];
}

export const suppliers: Supplier[] = [
    {
        id: '1',
        name: 'ADELAIDE MEGRATRON',
        city: 'Guaraciaba',
        region: 'Matriz',
        product: 'Cabos',
        phone: '5511999513891',
        products: [
            'CABO BLINDADO 500m PURO COBRE',
            'CABO DE REDE SIMPLES 300m',
            'CABO COAXIAL 300m',
            'RÉGUA TOMADA 5P',
            'RÉGUA TOMADA 6P'
        ]
    },
    {
        id: '2',
        name: 'AMANDA DISCFONE',
        city: 'Guaraciaba',
        region: 'Matriz',
        product: 'Alarmes',
        phone: '5549991790952',
        products: [
            'CENTRAL ANM24 NET',
            'SENSOR IVP 5001 PET',
            'SENSOR MAGNÉTICO DE ABERTURA',
            'CABO DE ALARME'
        ]
    },
    {
        id: '3',
        name: 'AMAURI YES MOCELIN',
        city: 'Francisco Beltrão',
        region: 'Beltrão',
        product: 'Alarmes',
        phone: '554625206431',
        products: [
            'CENTRAL ANM24 NET',
            'SENSOR IVP 5001 PET',
            'SENSOR MAGNÉTICO DE ABERTURA',
            'CABO DE ALARME'
        ]
    },
    {
        id: '4',
        name: 'CRISTIANO ALMEIDA',
        city: 'Guaraciaba',
        region: 'Matriz',
        product: 'Parafusos',
        phone: '5546999797072',
        products: []
    },
    {
        id: '5',
        name: 'EDSON',
        city: 'Guaraciaba',
        region: 'Matriz',
        product: 'Fontes',
        phone: '5513996968947',
        products: []
    },
    {
        id: '6',
        name: 'ELIZABETH FRAPA',
        city: 'Guaraciaba',
        region: 'Matriz',
        product: 'Cabos',
        phone: '5511916478922',
        products: []
    },
    {
        id: '7',
        name: 'JP DISTRIBUIDORA',
        city: 'São Miguel do Oeste',
        region: 'Matriz',
        product: 'Materiais Diversos',
        phone: '5549999285677',
        products: [
            'SILICONE AFIX',
            'COLA',
            'BUCHA 6',
            'FITA ISOLANTE PRETA',
            'FITA ISOLANTE BRANCA',
            'DUPLA FACE 3M',
            'PRESILHA PEQUENA',
            'PRESILHA MEDIA',
            'PRESILHA GRANDE'
        ]
    },
    {
        id: '8',
        name: 'MAZER DISTRIBUIDORA',
        city: 'Guaraciaba',
        region: 'Sul',
        product: 'Equipamentos Eletrônicos',
        phone: '555121012177',
        products: [
            'SSD 240GB WDGREEN OU SANDISK',
            'SSD 480GB WDGREEN OU SANDISK',
            'HD 1TB WD PURPLE',
            'HD 2TB WD PURPLE'
        ]
    },
    {
        id: '9',
        name: 'MATHEUS DIGISEG',
        city: 'Pato Branco',
        region: 'Beltrão',
        product: 'Alarmes',
        phone: '5546999800022',
        products: [
            'CENTRAL ANM24 NET',
            'SENSOR IVP 5001 PET',
            'SENSOR MAGNÉTICO DE ABERTURA',
            'CABO DE ALARME'
        ]
    },
    {
        id: '10',
        name: 'PAUTA DISTRIBUIÇÃO',
        city: 'Guaraciaba',
        region: 'Sul',
        product: 'Equipamentos Eletrônicos',
        phone: '558004040000',
        products: [
            'SSD 240GB WDGREEN OU SANDISK',
            'SSD 480GB WDGREEN OU SANDISK',
            'HD 1TB WD PURPLE',
            'HD 2TB WD PURPLE',
            'NOBREAK 600VA SMS',
            'NOBREAK 1200VA SMS'
        ]
    },
    {
        id: '11',
        name: 'THAYRINE',
        city: 'Guaraciaba',
        region: 'Matriz',
        product: 'Fontes',
        phone: '5548991350245',
        products: []
    },
    {
        id: '12',
        name: 'THIARA TWG',
        city: 'Guaraciaba',
        region: 'Matriz',
        product: 'Conectores',
        phone: '5511983467045',
        products: [
            'CONECTOR BNC',
            'CONECTOR P4'
        ]
    },
    {
        id: '13',
        name: 'VARLEI',
        city: 'Guaraciaba',
        region: 'Matriz',
        product: 'DVRs e SSDs',
        phone: '5549991222487',
        products: []
    },
    {
        id: '14',
        name: 'YES MOCELIN TOLEDO',
        city: 'Toledo',
        region: 'Palotina',
        product: 'Alarmes',
        phone: '554520380008',
        products: [
            'CENTRAL ANM24 NET',
            'SENSOR IVP 5001 PET',
            'SENSOR MAGNÉTICO DE ABERTURA',
            'CABO DE ALARME'
        ]
    },
    {
        id: '15',
        name: 'CATITECH',
        city: 'Guaraciaba',
        region: 'Matriz',
        product: 'RJs45',
        phone: '5514981236074',
        products: []
    },
    {
        id: '16',
        name: 'RIBEIRO FABRIL',
        city: 'Guaraciaba',
        region: 'Matriz',
        product: 'Miguelão de Buchas',
        phone: '5519971342947',
        products: [
            'CARTUCHO MIGUELAO DE MADEIRA',
            'CARTUCHO MIGUELAO DE CONCRETO',
            'BUCHA 6'
        ]
    }
];
