'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Wallet, 
  PlusCircle, 
  HeartHandshake, 
  Building2, 
  ShieldCheck, 
  ArrowUpRight, 
  Search,
  ExternalLink,
  Coins
} from 'lucide-react';
import { DAFund, MOCK_NONPROFITS, Nonprofit } from '../lib/stellar';

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  
  // Active DAF State
  const [funds, setFunds] = useState<DAFund[]>([
    {
      id: 'fund-101',
      name: 'Stellar Climate & Education DAF',
      donor: 'GAK4...8821',
      balanceXLM: 12500,
      balanceUSDC: 4500,
      createdAt: '2026-07-15',
    },
  ]);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newFundName, setNewFundName] = useState('');

  const [showGrantModal, setShowGrantModal] = useState(false);
  const [selectedNonprofit, setSelectedNonprofit] = useState<Nonprofit | null>(null);
  const [grantAmount, setGrantAmount] = useState('');
  const [grantMemo, setGrantMemo] = useState('');

  // Connect Freighter / Stellar Wallet Mock
  const handleConnectWallet = () => {
    if (!walletConnected) {
      setWalletConnected(true);
      setWalletAddress('GAK4...8821');
    } else {
      setWalletConnected(false);
      setWalletAddress('');
    }
  };

  // Handle DAF Fund Creation
  const handleCreateFund = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFundName) return;

    const newFund: DAFund = {
      id: `fund-${Date.now()}`,
      name: newFundName,
      donor: walletAddress || 'GAK4...8821',
      balanceXLM: 1000,
      balanceUSDC: 500,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setFunds([newFund, ...funds]);
    setNewFundName('');
    setShowCreateModal(false);
  };

  // Handle Grant Recommendation
  const handleRecommendGrant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNonprofit || !grantAmount) return;

    alert(`Grant recommendation of ${grantAmount} XLM to "${selectedNonprofit.name}" submitted to Soroban DAF contract!`);
    setShowGrantModal(false);
    setGrantAmount('');
    setGrantMemo('');
  };

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px 80px 20px' }}>
      {/* Navigation */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1, #f59e0b)',
            padding: '10px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={24} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0 }}>EndowStellar</h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Onchain DAFs on Soroban</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span className="badge badge-stellar">
            Stellar Testnet
          </span>
          
          <button className={walletConnected ? "btn-secondary" : "btn-primary"} onClick={handleConnectWallet}>
            <Wallet size={18} />
            {walletConnected ? `${walletAddress}` : 'Connect Wallet'}
          </button>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="glass-panel" style={{ padding: '40px', marginBottom: '40px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '680px' }}>
          <span className="badge badge-stellar" style={{ marginBottom: '16px' }}>
            <Coins size={14} style={{ marginRight: '6px' }} /> Low-Fee Crypto Philanthropy
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '16px' }}>
            Transforming Giving with <span className="gradient-text">Stellar Endowment Funds</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '28px' }}>
            Open a tax-exempt Donor-Advised Fund (DAF) on Stellar. Deposit XLM or USDC, grow your impact, and disburse grants to 501(c)(3) charities with instant finality.
          </p>
          
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
              <PlusCircle size={18} /> Start a DAF Fund
            </button>
            <a href="#nonprofits" className="btn-secondary" style={{ textDecoration: 'none' }}>
              <Building2 size={18} /> Explore Nonprofits
            </a>
          </div>
        </div>
      </section>

      {/* Main Grid Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '48px' }}>
        
        {/* Your DAFs Column */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Your Donor-Advised Funds</h3>
            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }} onClick={() => setShowCreateModal(true)}>
              + New Fund
            </button>
          </div>

          {funds.length === 0 ? (
            <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>No active DAF funds found.</p>
            </div>
          ) : (
            funds.map((fund) => (
              <div key={fund.id} className="glass-panel" style={{ padding: '24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{fund.name}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Advisor: {fund.donor}</span>
                  </div>
                  <span className="badge badge-verified">Active DAF</span>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>XLM Balance</span>
                    <strong style={{ color: 'var(--stellar-gold)' }}>{fund.balanceXLM.toLocaleString()} XLM</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>USDC Balance</span>
                    <strong style={{ color: '#818cf8' }}>${fund.balanceUSDC.toLocaleString()} USDC</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}>
                    Deposit Assets
                  </button>
                  <a href="#nonprofits" className="btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem', textDecoration: 'none' }}>
                    Recommend Grant
                  </a>
                </div>
              </div>
            ))
          )}
        </section>

        {/* Impact Overview Column */}
        <section>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px' }}>Philanthropic Impact</h3>
          
          <div className="glass-panel" style={{ padding: '24px', marginBottom: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Granted</span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-glow)' }}>35,000 XLM</h3>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Charities Supported</span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#4ade80' }}>12 Nonprofits</h3>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <ShieldCheck size={16} color="#4ade80" />
                100% Tax-deductible contributions on Stellar.
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Nonprofits Directory Section */}
      <section id="nonprofits" style={{ marginTop: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Explore Verified Nonprofits</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Recommend DAF grants directly to 501(c)(3) tax-exempt organizations.</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {MOCK_NONPROFITS.map((np) => (
            <div key={np.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <span className="badge badge-stellar" style={{ fontSize: '0.7rem' }}>{np.category}</span>
                  {np.verified501c3 && <span className="badge badge-verified" style={{ fontSize: '0.7rem' }}>501(c)(3) Verified</span>}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '8px' }}>{np.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '16px' }}>{np.description}</p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                <button 
                  className="btn-primary" 
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => {
                    setSelectedNonprofit(np);
                    setShowGrantModal(true);
                  }}
                >
                  <HeartHandshake size={16} /> Recommend Grant
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Start DAF Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{ padding: '32px', maxWidth: '480px', width: '100%' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '12px' }}>Start a New DAF Fund</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Instantiate a brand new Soroban DAF smart contract. You will hold donor advisory rights for grant distributions.
            </p>

            <form onSubmit={handleCreateFund}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  DAF Fund Name
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Hope & Innovation Foundation" 
                  value={newFundName}
                  onChange={(e) => setNewFundName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-light)',
                    color: '#fff',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Deploy Soroban DAF
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recommend Grant Modal */}
      {showGrantModal && selectedNonprofit && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{ padding: '32px', maxWidth: '480px', width: '100%' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>Recommend a Grant</h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--primary-glow)', display: 'block', marginBottom: '20px' }}>
              Recipient: {selectedNonprofit.name}
            </span>

            <form onSubmit={handleRecommendGrant}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Grant Amount (XLM)
                </label>
                <input 
                  type="number" 
                  placeholder="e.g. 500" 
                  value={grantAmount}
                  onChange={(e) => setGrantAmount(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-light)',
                    color: '#fff',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                  Grant Purpose / Note
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Annual clean water initiative support" 
                  value={grantMemo}
                  onChange={(e) => setGrantMemo(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-light)',
                    color: '#fff',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowGrantModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Submit Grant Recommendation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
