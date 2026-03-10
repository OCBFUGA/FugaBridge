from pohc_engine import PoHCEngine
import numpy as np

def run_advanced_pohc_demo():
    engine = PoHCEngine()
    
    scenarios = [
        {
            "name": "Feedback Simples (Bot)",
            "text": "Muito bom.",
            "stats": {'miner_a_score': 0.5, 'miner_b_score': 0.5}
        },
        {
            "name": "Feedback Médio (Humano Padrão)",
            "text": "O minerador A respondeu melhor pois citou a documentação oficial da Arbitrum.",
            "stats": {'miner_a_score': 0.8, 'miner_b_score': 0.4}
        },
        {
            "name": "Feedback de Alta Nuance (Especialista)",
            "text": "A implementação da porta 3000 pelo minerador A demonstra um entendimento profundo de concorrência em Node.js, superando a abordagem básica do minerador B que ignorou o tratamento de erros.",
            "stats": {'miner_a_score': 0.95, 'miner_b_score': 0.2}
        }
    ]

    print("=== FUGA BRIDGE: SIMULAÇÃO DE CAMPO COGNITIVO (PoHC) ===")
    print("Validando equações de Janio: LACA + QAE + DPM\n")

    for s in scenarios:
        score = engine.compute_pohc_score(s['text'], s['stats'])
        print(f"Cenário: {s['name']}")
        print(f"Texto: '{s['text']}'")
        print(f"Score de 'Residuo Cognitivo' (epsilon_min): {score:.6f}")
        print("-" * 50)

if __name__ == "__main__":
    run_advanced_pohc_demo()
