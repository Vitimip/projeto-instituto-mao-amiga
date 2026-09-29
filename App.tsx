import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import {
    createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TelaListaPontos, {
    pontosIniciais,
    type Ponto,
} from './TelaListaPontos';
import TelaDetalhePonto from './TelaDetalhePonto';
import TelaCadastroDoacao from './TelaCadastroDoacao';
import TelaMinhasDoacoes from './TelaMinhasDoacoes';

export type RootStackParamList = {
    ListaPontos: undefined;
    DetalhePonto: { pontoId: string } | undefined;
    CadastroDoacao: { pontoId: string } | undefined;
    MinhasDoacoes: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const CHAVE_PONTOS = '@pontos';

function App() {
    const [pontos, setPontos] = useState<Ponto[]>([]);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        carregarPontos();
    }, []);

    async function carregarPontos() {
        try {
            const dadosSalvos = await AsyncStorage.getItem(CHAVE_PONTOS);

            if (dadosSalvos) {
                const pontosSalvos: Ponto[] = JSON.parse(dadosSalvos);
                setPontos(pontosSalvos);
            } else {
                setPontos(pontosIniciais);
                await AsyncStorage.setItem(
                    CHAVE_PONTOS,
                    JSON.stringify(pontosIniciais)
                );
            }
        } catch (erro) {
            console.log('Erro ao carregar pontos:', erro);
            setPontos(pontosIniciais);
        } finally {
            setCarregando(false);
        }
    }

    async function adicionarPonto(ponto: Ponto) {
        const pontosAtualizados = [...pontos, ponto];

        setPontos(pontosAtualizados);

        try {
            await AsyncStorage.setItem(
                CHAVE_PONTOS,
                JSON.stringify(pontosAtualizados)
            );
        } catch (erro) {
            console.log('Erro ao salvar ponto:', erro);
        }
    }

    if (carregando) {
        return null;
    }

    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="ListaPontos">

                    <Stack.Screen name="ListaPontos">
                        {(props) => (
                            <TelaListaPontos
                                {...props}
                                pontos={pontos}
                                onAdicionarPonto={adicionarPonto}
                            />
                        )}
                    </Stack.Screen>

                    <Stack.Screen name="DetalhePonto">
                        {(props) => (
                            <TelaDetalhePonto
                                {...props}
                                pontos={pontos}
                            />
                        )}
                    </Stack.Screen>

                    <Stack.Screen name="CadastroDoacao">
                        {(props) => (
                            <TelaCadastroDoacao
                                {...props}
                                pontos={pontos}
                            />
                        )}
                    </Stack.Screen>
                    <Stack.Screen name="MinhasDoacoes">
                        {(props) => (
                            <TelaMinhasDoacoes
                                {...props}
                                pontos={pontos}
                            />
                        )}
                    </Stack.Screen>
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}

export default App;
