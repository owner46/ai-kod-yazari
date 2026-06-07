import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator, Clipboard, SafeAreaView,
  StatusBar, Alert,
} from 'react-native';

const LANGUAGES = [
  { id: 'python', label: 'Python', icon: '🐍' },
  { id: 'javascript', label: 'JavaScript', icon: '⚡' },
  { id: 'kotlin', label: 'Kotlin', icon: '🎯' },
  { id: 'java', label: 'Java', icon: '☕' },
  { id: 'swift', label: 'Swift', icon: '🍎' },
];

const MODES = [
  { id: 'write', label: 'Kod Yaz', icon: '✍️' },
  { id: 'explain', label: 'Açıkla', icon: '🔍' },
  { id: 'fix', label: 'Hata Düzelt', icon: '🔧' },
  { id: 'optimize', label: 'Optimize', icon: '⚡' },
];

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState('python');
  const [mode, setMode] = useState('write');

  const generate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `Sen uzman bir ${lang} geliştiricisisin. Kullanıcının isteğine göre kod yaz ve Türkçe açıkla.`,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map((b: any) => b.text || '').join('') || '';
      setResult(text);
    } catch (e) {
      setResult('Hata oluştu. İnternet bağlantınızı kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  const copyResult = () => {
    Clipboard.setString(result);
    Alert.alert('Kopyalandı!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0e1a" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerIcon}>⚡</Text>
          <View>
            <Text style={styles.headerTitle}>AI Kod Yazarı</Text>
            <Text style={styles.headerSub}>Powered by Claude</Text>
          </View>
        </View>

        {/* Mode */}
        <Text style={styles.sectionLabel}>MOD</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {MODES.map(m => (
            <TouchableOpacity
              key={m.id}
              onPress={() => setMode(m.id)}
              style={[styles.chip, mode === m.id && styles.chipActive]}>
              <Text style={[styles.chipText, mode === m.id && styles.chipTextActive]}>
                {m.icon} {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Language */}
        <Text style={styles.sectionLabel}>DİL</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {LANGUAGES.map(l => (
            <TouchableOpacity
              key={l.id}
              onPress={() => setLang(l.id)}
              style={[styles.chip, lang === l.id && styles.chipLang]}>
              <Text style={[styles.chipText, lang === l.id && styles.chipTextLang]}>
                {l.icon} {l.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputBox}>
          <TextInput
            style={styles.input}
            value={prompt}
            onChangeText={setPrompt}
            placeholder="Ne yazmamı istersin?"
            placeholderTextColor="#484f58"
            multiline
            numberOfLines={4}
          />
          <TouchableOpacity
            style={[styles.button, (!prompt.trim() || loading) && styles.buttonDisabled]}
            onPress={generate}
            disabled={!prompt.trim() || loading}>
            {loading
              ? <ActivityIndicator color="#000" />
              : <Text style={styles.buttonText}>⚡ Üret</Text>}
          </TouchableOpacity>
        </View>

        {/* Result */}
        {result !== '' && (
          <View style={styles.resultBox}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>● Sonuç</Text>
              <TouchableOpacity onPress={copyResult}>
                <Text style={styles.copyBtn}>Kopyala</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.resultText}>{result}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0e1a' },
  scroll: { padding: 16, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
  headerIcon: { fontSize: 28, backgroundColor: '#7c4dff', borderRadius: 10, padding: 6 },
  headerTitle: { color: '#e6edf3', fontSize: 18, fontWeight: '700' },
  headerSub: { color: '#7d8590', fontSize: 11 },
  sectionLabel: { color: '#7d8590', fontSize: 10, letterSpacing: 1, marginBottom: 8, marginTop: 4 },
  chipRow: { marginBottom: 16 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#ffffff15', backgroundColor: '#ffffff08', marginRight: 8 },
  chipActive: { borderColor: '#00e5ff', backgroundColor: '#00e5ff18' },
  chipLang: { borderColor: '#7c4dff', backgroundColor: '#7c4dff20' },
  chipText: { color: '#8b949e', fontSize: 13 },
  chipTextActive: { color: '#00e5ff' },
  chipTextLang: { color: '#b39ddb' },
  inputBox: { backgroundColor: '#0d1117', borderRadius: 16, borderWidth: 1, borderColor: '#30363d', overflow: 'hidden', marginBottom: 16 },
  input: { color: '#e6edf3', fontSize: 14, padding: 16, minHeight: 100, textAlignVertical: 'top' },
  button: { margin: 12, backgroundColor: '#00e5ff', borderRadius: 10, padding: 14, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#ffffff15' },
  buttonText: { color: '#000', fontWeight: '700', fontSize: 14 },
  resultBox: { backgroundColor: '#0d1117', borderRadius: 16, borderWidth: 1, borderColor: '#30363d', overflow: 'hidden' },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, backgroundColor: '#161b22', borderBottomWidth: 1, borderBottomColor: '#30363d' },
  resultTitle: { color: '#00e5ff', fontSize: 12 },
  copyBtn: { color: '#7d8590', fontSize: 12, borderWidth: 1, borderColor: '#30363d', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  resultText: { color: '#e6edf3', fontSize: 13, padding: 16, lineHeight: 22, fontFamily: 'monospace' },
});
