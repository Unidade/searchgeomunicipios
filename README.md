# Sumário

Este projeto é um mapa interativo de todos os municipios do Brasil, utiliza os dados de [malhas municipais](https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/) e [censo demográfico](https://www.ibge.gov.br/estatisticas/sociais/trabalho/22827-censo-demografico-2022.html)(dados de 2022 IBGE). É possivel realizar buscas complexas geospacais, utilizar filtros, além de visualizar dados como total população de uma área qualquer.

## Tecnologias

Foi utilizado Redis GEOSHAPE Polygon introduzido no Redis Stack 7.2 para realizar o armanenamento das coordenadas dos estados brasileiros e realizar buscar municipios que estão dentro de dado um poligono qualquer

### Backend

- Express
- Redis Stack <= 7.2

### Frontend

- OpenLayers, mapas interativos
- Nextjs
- TailwindCSS

## Como iniciar

1. Clone este repositório  
   `git clone `
2. Inicialize os container  
   `docker-compose up -d`
3. Abra o navegador no seguinte link  
   [localhost:8080](http://localhost:8080)

## Documentação Técnica

Foi necessário realizar o mapeamento entre as informações fornecidas pela fonte de dados [IBGE] as estruturadas de dados suportadas pelo Redis.

```js
    CD_MUN: code,
    NM_MUN: name,
    SIGLA_UF: state,
    AREA_KM2: area_km2,
    geometry: <wellknown polygon string>
```
