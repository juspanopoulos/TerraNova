# TerraNova IA

## Sobre o Projeto

TerraNova IA é a API Flask responsável pelos modelos preditivos usados pela plataforma TerraNova. Ela apoia a análise agrícola com previsões de produtividade e recomendações de irrigação.

A solução combina modelos de Machine Learning, dados climáticos e informações operacionais fornecidas pelo usuário para gerar previsões e recomendações persistidas pela API Java/Quarkus.

---

## Inteligência Artificial no Projeto

A solução utiliza dois modelos de Machine Learning especializados.

### Modelo 1 - Previsão de Produtividade Agrícola

Este modelo estima a produtividade de uma cultura com base em fatores como:

* Tipo de solo
* Tipo de cultura
* Temperatura
* Precipitação
* Irrigação
* Região
* Dias até a colheita

A partir dessas informações, o modelo realiza uma previsão da produtividade esperada e classifica o resultado em níveis de desempenho.

---

### Modelo 2 - Recomendação de Irrigação

Este modelo analisa o consumo de água na produção agrícola.

Para isso, utiliza informações como:

* Tipo de cultura
* Umidade do solo
* Estágio de crescimento
* Área plantada
* Método de irrigação
* Irrigação anterior
* Consumo atual de água

Com base nesses dados, o sistema gera recomendações para auxiliar no uso eficiente da água, contribuindo para a redução de desperdícios e para uma irrigação mais sustentável.

---

## Integração com Dados Climáticos

Para complementar as análises, o sistema utiliza informações climáticas obtidas por meio da NASA POWER API.

Entre os dados utilizados estão:

* Temperatura
* Umidade
* Precipitação
* Velocidade do vento
* Radiação solar

Essas informações auxiliam os modelos de Machine Learning a produzir previsões mais próximas das condições reais da lavoura.

---

## Objetivo Final

O principal objetivo do TerraNova é fornecer uma ferramenta inteligente de apoio à decisão agrícola, capaz de unir análise de dados e Machine Learning para melhorar a produtividade, promover o uso consciente da água e contribuir para uma agricultura mais eficiente e sustentável.
