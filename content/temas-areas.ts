// Rascunhos informativos. Publicar somente após revisão jurídica individual.
// Fontes e escopo da revisão: docs/fontes-temas.md.
export type TemaArea = { descricao: string; revisado: boolean };
const descricoes: Record<string, string> = {
  'Rescisão do contrato de trabalho':
    'O encerramento de um vínculo de trabalho envolve a modalidade de desligamento, os documentos e as parcelas relacionadas ao contrato. A análise reúne o histórico da relação, os comprovantes de pagamento e o termo de rescisão para esclarecer o que precisa ser conferido em cada caso.',
  'Horas extras e jornada':
    'A jornada envolve horários de entrada e saída, intervalos, escalas e eventuais compensações. Registros de ponto, acordos e a rotina efetivamente cumprida ajudam a compreender diferenças entre o que foi combinado, trabalhado e pago.',
  'Acidentes de trabalho':
    'Acidentes e doenças relacionados ao trabalho podem envolver questões trabalhistas e previdenciárias. O contexto da atividade, os registros do ocorrido e os documentos médicos ajudam a avaliar a relação com o trabalho e os encaminhamentos possíveis.',
  'Verbas e direitos trabalhistas':
    'Salário, férias, décimo terceiro e outras parcelas precisam ser examinados conforme o vínculo e a situação concreta. A conferência de recibos, contratos e registros permite identificar a composição dos pagamentos e esclarecer dúvidas sobre diferenças.',
  'Orientação a empregados e empregadores':
    'Dúvidas podem surgir na contratação, durante a relação de trabalho ou no desligamento. A orientação considera a rotina, os documentos e as normas aplicáveis para ajudar empregados e empregadores a compreender suas responsabilidades e organizar decisões.',
  'Divórcio e dissolução de união estável':
    'O fim de uma relação pode exigir decisões sobre patrimônio, filhos e obrigações entre as partes. A orientação organiza essas questões de acordo com a realidade da família e avalia os caminhos adequados para formalizar o encerramento do vínculo.',
  'Guarda e convivência familiar':
    'A organização da guarda e da convivência considera as necessidades dos filhos e a realidade de quem participa de seus cuidados. Rotina, comunicação e responsabilidades são analisadas com atenção à proteção e ao interesse da criança ou do adolescente.',
  'Pensão alimentícia':
    'A discussão sobre alimentos envolve as necessidades de quem recebe e as possibilidades de quem contribui. Documentos de renda, despesas e mudanças na situação familiar ajudam a analisar pedidos de fixação, revisão ou cumprimento de uma obrigação existente.',
  'Reconhecimento de união estável':
    'O reconhecimento de uma união estável exige compreender como a relação se desenvolveu e quais efeitos jurídicos estão em discussão. A análise reúne os fatos e os documentos disponíveis, inclusive quando existem questões patrimoniais ou sucessórias.',
  'Acordos familiares':
    'Acordos podem organizar responsabilidades, convivência, alimentos e questões patrimoniais. A construção do documento considera a vontade das partes, a proteção dos envolvidos e as formalidades necessárias para cada situação.',
  'Inventário judicial':
    'O inventário judicial organiza a identificação dos herdeiros, dos bens e das obrigações deixados pela pessoa falecida. A análise do patrimônio e da situação familiar orienta o procedimento e as questões que precisam ser resolvidas antes da partilha.',
  'Inventário extrajudicial':
    'Em situações que atendem aos requisitos aplicáveis, o inventário pode ser realizado em cartório. A orientação verifica a documentação, as condições dos interessados e as regras vigentes para avaliar se essa via é adequada ao caso.',
  'Partilha de bens':
    'A partilha define como determinado patrimônio será distribuído entre os interessados. A origem dos bens, o regime patrimonial, as dívidas e os direitos envolvidos precisam ser examinados para organizar a divisão e sua formalização.',
  Testamentos:
    'O testamento permite registrar disposições para depois da morte, dentro dos limites legais. A orientação ajuda a compreender as formas disponíveis, as exigências de validade e a relação entre a vontade manifestada e os direitos dos herdeiros.',
  'Planejamento sucessório':
    'O planejamento sucessório examina a organização do patrimônio e sua futura transmissão. A análise considera a composição familiar, os bens e os efeitos dos instrumentos disponíveis, sem uma solução única para todas as famílias.',
  Aposentadoria:
    'A análise de aposentadoria reúne idade, histórico de contribuições, atividades exercidas e documentos do segurado. Esse conjunto permite verificar as regras aplicáveis e eventuais informações que precisam ser corrigidas ou complementadas antes de um requerimento.',
  'Benefícios por incapacidade':
    'Esses benefícios envolvem a avaliação da incapacidade para o trabalho e dos requisitos previdenciários aplicáveis. Histórico de contribuições, documentos médicos e informações sobre a atividade exercida ajudam a compreender a situação e o procedimento adequado.',
  'Pensão por morte':
    'A pensão por morte exige examinar a situação previdenciária da pessoa falecida e o vínculo de quem solicita o benefício. Certidões e documentos relativos à dependência e à vida contributiva compõem a análise individual.',
  'Análise de contribuições':
    'O histórico previdenciário pode apresentar períodos ausentes, dados divergentes ou registros que exigem comprovação. A conferência do CNIS e dos documentos de trabalho e recolhimento ajuda a identificar quais informações merecem revisão.',
  'Requerimentos e recursos administrativos':
    'Pedidos e recursos no âmbito previdenciário dependem da organização das informações e da compreensão da decisão administrativa. A orientação examina os documentos apresentados, a justificativa de eventual indeferimento e as possibilidades de complementação ou contestação.',
  'Cobranças indevidas':
    'Uma cobrança pode gerar dúvidas sobre sua origem, o valor exigido ou um pagamento já realizado. Contratos, faturas e comprovantes ajudam a verificar a situação e a avaliar como apresentar a contestação ao fornecedor.',
  'Problemas com produtos':
    'Defeitos, divergências na entrega e dificuldades de uso precisam ser analisados conforme o produto e as circunstâncias da compra. Nota fiscal, garantia, registros do problema e contatos com o fornecedor ajudam a esclarecer o ocorrido.',
  'Falhas na prestação de serviços':
    'Quando um serviço apresenta falhas ou difere do que foi contratado, é necessário comparar a oferta, o contrato e o que foi entregue. Registros de atendimento e tentativas de solução contribuem para avaliar as responsabilidades envolvidas.',
  'Contratos de consumo':
    'Contratos de consumo estabelecem condições de pagamento, prestação, renovação e cancelamento. A leitura das cláusulas e da oferta ajuda a esclarecer obrigações e a identificar pontos que merecem análise antes ou depois da contratação.',
  'Inscrição em cadastros de crédito':
    'Uma restrição de crédito exige verificar a origem da dívida e as informações registradas. Comprovantes de pagamento, comunicações e documentos da contratação ajudam a analisar a regularidade da inscrição e eventuais pedidos de correção.',
  Contratos:
    'Um contrato organiza direitos, obrigações e condições de uma relação. A elaboração ou revisão considera o objetivo das partes, os riscos identificados e a clareza das regras sobre pagamento, execução e encerramento.',
  'Responsabilidade civil':
    'A responsabilidade civil envolve a análise de um dano, de suas causas e da atuação dos envolvidos. Documentos e demais elementos de prova ajudam a avaliar se existe fundamento para discutir reparação no caso concreto.',
  Cobranças:
    'A cobrança de uma obrigação exige compreender sua origem, os vencimentos e os documentos que a demonstram. A orientação examina tanto a exigência apresentada quanto possíveis pagamentos, divergências e caminhos de negociação.',
  'Obrigações entre particulares':
    'Compromissos entre pessoas podem envolver pagamentos, entregas ou a realização de uma atividade. A análise considera o que foi acordado, como a relação se desenvolveu e quais dúvidas ou descumprimentos precisam ser resolvidos.',
  'Análise e negociação de acordos':
    'Antes de formalizar um acordo, é necessário compreender seu alcance e as obrigações assumidas. A orientação examina condições de cumprimento, documentação e consequências previstas para que a decisão seja tomada com informação.',
  'Compra e venda de imóveis':
    'A negociação de um imóvel envolve o contrato, a situação registral e a documentação das partes. Essa análise ajuda a esclarecer as condições do negócio e as providências necessárias para sua formalização.',
  Locação:
    'A locação envolve responsabilidades sobre uso do imóvel, pagamentos, garantias, conservação e devolução. Contrato, vistoria e comunicações entre as partes ajudam a compreender dúvidas durante a relação ou no seu encerramento.',
  'Regularização de imóveis':
    'Regularizar um imóvel exige identificar o que diverge entre sua situação atual e os documentos disponíveis. Matrícula, contratos e registros administrativos orientam a avaliação das providências possíveis para cada tipo de pendência.',
  Usucapião:
    'A usucapião envolve o reconhecimento da propriedade a partir de uma situação de posse que preencha requisitos legais. O tempo, as características da ocupação e os documentos disponíveis precisam ser avaliados de acordo com a modalidade discutida.',
  'Conflitos de posse e propriedade':
    'Disputas sobre ocupação, limites ou titularidade de um imóvel exigem distinguir a situação de fato dos registros existentes. A análise do histórico e das provas ajuda a compreender o conflito e os instrumentos jurídicos aplicáveis.',
  'Contratos empresariais':
    'Contratos empresariais organizam relações com fornecedores, clientes e parceiros. A análise considera a operação, a distribuição de responsabilidades e as condições de cumprimento, revisão e encerramento do negócio.',
  'Constituição de sociedades':
    'A formação de uma sociedade exige definir sua estrutura e as regras de participação e administração. A orientação considera a atividade pretendida, as responsabilidades dos sócios e os documentos necessários à formalização.',
  'Relações entre sócios':
    'Questões entre sócios podem envolver gestão, participação, distribuição de resultados ou saída da sociedade. O contrato social e o histórico da empresa ajudam a examinar direitos, deveres e possibilidades de composição.',
  'Negociação de obrigações':
    'Renegociar uma obrigação empresarial exige avaliar sua origem e as condições reais de cumprimento. A análise dos contratos e das propostas ajuda a estruturar alternativas e registrar com clareza o que for acordado.',
  'Reorganização empresarial':
    'Mudanças na estrutura ou na atividade de uma empresa podem exigir ajustes societários e contratuais. A orientação examina o contexto do negócio, as obrigações existentes e os efeitos jurídicos das alternativas consideradas.',
  'Contratos rurais':
    'Contratos rurais organizam relações ligadas ao uso da terra e à atividade produtiva. A análise considera as características da exploração, os compromissos assumidos e as regras específicas aplicáveis à operação.',
  'Arrendamento e parceria rural':
    'Arrendamento e parceria possuem estruturas próprias para organizar a exploração rural. O tipo de relação, a remuneração e a distribuição de riscos precisam ser compreendidos antes de elaborar, revisar ou encerrar o contrato.',
  'Dívidas do produtor':
    'A análise de uma dívida rural considera sua origem, o instrumento contratado e as condições de pagamento. Contratos, garantias e informações da atividade ajudam a avaliar a cobrança e eventuais possibilidades de negociação.',
  'Relações comerciais do agronegócio':
    'Compra de insumos, venda da produção e prestação de serviços envolvem compromissos comerciais que precisam estar claros. A orientação examina condições de entrega, pagamento, qualidade e responsabilidades previstas na relação.',
  'Questões de propriedade rural':
    'Questões sobre um imóvel rural podem envolver posse, registro, limites e documentação. A análise conjunta desses elementos ajuda a identificar pendências e a organizar os encaminhamentos necessários à situação concreta.',
  'Acompanhamento de inquéritos':
    'O inquérito reúne elementos sobre fatos investigados e pode envolver diligências, documentos e depoimentos. O acompanhamento jurídico permite compreender o procedimento e avaliar a proteção dos direitos da pessoa envolvida.',
  'Defesa em processos criminais':
    'A defesa criminal exige conhecer a acusação, as provas e a etapa em que o processo se encontra. O acompanhamento considera as particularidades do caso para avaliar manifestações e medidas processuais cabíveis.',
  'Orientação em depoimentos':
    'Um depoimento deve ser compreendido conforme a condição em que a pessoa foi chamada e o procedimento envolvido. A orientação esclarece direitos, deveres e a dinâmica do ato, preservando a responsabilidade sobre as informações prestadas.',
  'Acompanhamento em delegacia':
    'O atendimento em delegacia pode envolver registros, esclarecimentos e outros atos de investigação. A orientação considera a situação apresentada e acompanha as providências pertinentes à proteção dos direitos envolvidos.',
  'Análise de medidas judiciais':
    'Pedidos, decisões e medidas no âmbito criminal precisam ser examinados conforme os fatos e a fase do procedimento. A análise dos documentos permite avaliar sua fundamentação e os meios processuais adequados para cada situação.',
  'Análise de obrigações tributárias':
    'Obrigações tributárias envolvem pagamentos e deveres de informação perante o poder público. A análise considera a atividade, os documentos fiscais e as normas aplicáveis para esclarecer dúvidas e identificar pontos que exigem atenção.',
  'Defesa administrativa fiscal':
    'Uma cobrança ou autuação fiscal exige examinar a justificativa da administração e os documentos relacionados. A orientação avalia os pontos de divergência e organiza os elementos necessários à manifestação no procedimento administrativo.',
  'Discussões judiciais tributárias':
    'Discussões tributárias podem envolver a interpretação de normas, a exigência de um tributo ou a regularidade de uma cobrança. A análise jurídica considera os fatos e os documentos para avaliar as medidas judiciais adequadas.',
  'Planejamento tributário':
    'O planejamento tributário examina os efeitos fiscais de atividades e operações dentro das alternativas permitidas pela legislação. A orientação considera a realidade do contribuinte e as consequências das escolhas avaliadas.',
  'Regularização de débitos':
    'A regularização começa pela identificação da origem e da situação de cada débito. A análise dos registros e das regras aplicáveis permite avaliar formas de pagamento, negociação ou contestação, conforme o caso.',
};

export const temasAreas: Record<string, TemaArea> = Object.fromEntries(
  Object.entries(descricoes).map(([titulo, descricao]) => [
    titulo,
    { descricao, revisado: false },
  ]),
);
