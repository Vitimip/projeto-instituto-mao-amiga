import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import {Ponto} from "./TelaListaPontos";

type Props = {
    ponto: Ponto;
    onPress: () => void;
};

export default function PontoItem({ ponto, onPress }: Props) {
    return (
        <TouchableOpacity style={styles.item} onPress={onPress}>
            <Text style={styles.nome}>{ponto.nome}</Text>
            <Text style={styles.endereco}>{ponto.endereco}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    item: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    nome: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1B3A5C',
    },
    endereco: {
        fontSize: 13,
        color: '#757575',
        marginTop: 4,
    },
});