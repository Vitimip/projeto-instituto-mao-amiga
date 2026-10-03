import AsyncStorage from '@react-native-async-storage/async-storage';

export type Doacao = {
    id: number;
    tipoItem: string;
    quantidade: number;
    pontoDestinoId: string;
    criadoEm: string;
};

const CHAVE_DOACOES = '@doacoes';

export async function listarDoacoes(): Promise<Doacao[]> {
    try {
        const dados = await AsyncStorage.getItem(CHAVE_DOACOES);

        if (!dados) {
            return [];
        }

        return JSON.parse(dados);
    } catch (erro) {
        console.log('Erro ao carregar doações:', erro);
        return [];
    }
}

export async function salvarDoacao(doacao: Doacao): Promise<void> {
    try {
        const doacoes = await listarDoacoes();

        const doacoesAtualizadas = [
            ...doacoes,
            doacao,
        ];

        await AsyncStorage.setItem(
            CHAVE_DOACOES,
            JSON.stringify(doacoesAtualizadas)
        );
    } catch (erro) {
        console.log('Erro ao salvar doação:', erro);
    }
}

export async function excluirDoacao(id: number): Promise<void> {
    try {
        const doacoes = await listarDoacoes();

        const doacoesAtualizadas = doacoes.filter(
            (doacao) => doacao.id !== id
        );

        await AsyncStorage.setItem(
            CHAVE_DOACOES,
            JSON.stringify(doacoesAtualizadas)
        );
    } catch (erro) {
        console.log('Erro ao excluir doação:', erro);
    }
}
