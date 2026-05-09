import React, { useState } from 'react';
import axios from 'axios';
import { Sparkles, Send, Copy, RefreshCw, User, Building, Briefcase, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:8001' : '/api';

function App() {
  const [formData, setFormData] = useState({
    sender_name: '',
    company_name: '',
    product_description: '',
    recipient_name: '',
    recipient_role: '',
    tone: 'professional'
  });
  
  const [generatedEmail, setGeneratedEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setGeneratedEmail('');
    try {
      const response = await axios.post(`${API_BASE}/generate`, formData);
      setGeneratedEmail(response.data.email);
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Failed to generate email. Please check your API key and backend status.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="app-container">
      <header className="header">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="logo-text"
        >
          SPARK AI
        </motion.div>
        <p className="subtitle">High-converting cold emails, generated in seconds.</p>
      </header>

      <main className="grid-layout">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <Zap style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: '1.25rem' }}>Campaign Details</h2>
          </div>

          <div className="form-group">
            <label>Your Name</label>
            <input 
              name="sender_name"
              placeholder="e.g. John Doe"
              value={formData.sender_name}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Your Company</label>
            <input 
              name="company_name"
              placeholder="e.g. TechFlow Systems"
              value={formData.company_name}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Product/Service Description</label>
            <textarea 
              name="product_description"
              rows="4"
              placeholder="What are you selling? What's the main value proposition?"
              value={formData.product_description}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid-layout" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div className="form-group">
              <label>Recipient Name</label>
              <input 
                name="recipient_name"
                placeholder="e.g. Sarah Smith"
                value={formData.recipient_name}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Recipient Role</label>
              <input 
                name="recipient_role"
                placeholder="e.g. CTO"
                value={formData.recipient_role}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Tone of Voice</label>
            <select name="tone" value={formData.tone} onChange={handleInputChange}>
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="aggressive">Aggressive (Bold)</option>
              <option value="witty">Witty/Humorous</option>
            </select>
          </div>

          <button 
            className="generate-btn" 
            onClick={handleGenerate}
            disabled={isLoading || !formData.sender_name || !formData.product_description}
          >
            {isLoading ? <RefreshCw className="spin" size={20} /> : <Sparkles size={20} />}
            <span>{isLoading ? 'Igniting...' : 'Generate Email'}</span>
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card result-area"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem' }}>Output</h2>
            {generatedEmail && (
              <div className="action-bar" style={{ marginTop: 0 }}>
                <button className="secondary-btn" onClick={copyToClipboard}>
                  {copied ? 'Copied!' : <><Copy size={16} /> Copy</>}
                </button>
              </div>
            )}
          </div>

          <div className="email-content">
            <AnimatePresence mode="wait">
              {!generatedEmail && !isLoading && (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="empty-state"
                >
                  <Send size={48} strokeWidth={1} />
                  <p>Your AI-crafted masterpiece will appear here.</p>
                </motion.div>
              )}
              
              {isLoading && (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="empty-state"
                >
                  <RefreshCw size={48} className="spin" strokeWidth={1} />
                  <p>Analyzing recipient profile and crafting pitch...</p>
                </motion.div>
              )}

              {generatedEmail && (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {generatedEmail}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default App;
