# instituto-mao-amiga

Projeto Mobile usando React Native, estados, props e AsyncStorage para organização de atributos e gerenciamento de doações para uma ONG.

## Demonstração do aplicativo

Roteiro para apresentação de até 3 minutos:

1. **Registrar uma doação**
   - Abrir a tela de registro.
   - Informar o tipo do item, a quantidade e o ponto de destino.
   - Salvar a doação.

2. **Ver o histórico**
   - Abrir **Minhas doações**.
   - Mostrar a doação recém-registrada.
   - Destacar o resumo com o total de doações e as quantidades por tipo.

3. **Filtrar**
   - Digitar parte do tipo do item no campo de busca.
   - Mostrar que a lista é filtrada enquanto o texto é digitado.
   - Apagar a busca e mostrar novamente todas as doações.

4. **Editar**
   - Abrir o detalhe de uma doação.
   - Tocar em **Editar doação**.
   - Alterar a quantidade ou o tipo e salvar.
   - Voltar ao histórico e mostrar que o resumo foi atualizado.

5. **Excluir**
   - Abrir o detalhe de uma doação.
   - Tocar em **Excluir doação** e confirmar.
   - Voltar ao histórico e mostrar que a doação e os totais foram atualizados.

6. **Fechar e reabrir**
   - Fechar o aplicativo.
   - Abrir novamente.
   - Acessar o histórico e confirmar que as doações continuam salvas.

## Checklist antes da apresentação

- Testar histórico, detalhe e edição em pelo menos dois tamanhos de tela.
- Conferir se não há texto cortado, elementos sobrepostos ou conteúdo fora da área visível.
- Conferir os campos de busca e edição com o teclado aberto.
- Conferir se botões e opções tocáveis têm área de pelo menos 44x44 px.
- Testar cadastrar, editar e excluir e confirmar a atualização do histórico.
- Testar fechar e reabrir o aplicativo para confirmar a persistência.

## Decisão técnica para explicar

Os totais por tipo de item não são salvos no AsyncStorage. Eles são calculados a partir do array de doações sempre que os dados da tela mudam. Assim, existe apenas uma fonte de verdade: as próprias doações. Isso evita manter dados duplicados e impede que um total fique desatualizado depois de uma edição ou exclusão.

O acesso às doações também fica centralizado em `doacoesStorage.ts`. As telas usam funções como listar, salvar, atualizar e excluir, enquanto a regra de armazenamento fica em um único arquivo. Isso facilita a manutenção e evita duplicar código de AsyncStorage nas telas.
