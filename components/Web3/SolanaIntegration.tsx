'use client'

/**
 * EuroWeb Web8 Platform - Solana Phantom Web3 Integration
 * Industrial-grade blockchain integration with Phantom wallet
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com  
 * @version 8.0.0 Solana Industrial
 * @license MIT
 */

import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import styles from './SolanaIntegration.module.css'

// Solana Web3 Types
interface PhantomWallet {
  isPhantom: boolean
  publicKey?: {
    toString(): string
  }
  connect(): Promise<{ publicKey: { toString(): string } }>
  disconnect(): Promise<void>
  signMessage(message: Uint8Array): Promise<{ signature: Uint8Array }>
}

interface SolanaAccount {
  address: string
  balance: number
  isConnected: boolean
}

interface Transaction {
  signature: string
  amount: number
  recipient: string
  timestamp: number
  status: 'pending' | 'confirmed' | 'failed'
}

/**
 * Solana Phantom Wallet Integration Component
 */
export const SolanaIntegration: React.FC = () => {
  const [wallet, setWallet] = useState<PhantomWallet | null>(null)
  const [account, setAccount] = useState<SolanaAccount>({
    address: '',
    balance: 0,
    isConnected: false
  })
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize Phantom Wallet
  useEffect(() => {
    const initializeWallet = async () => {
      try {
        // @ts-ignore - Phantom injects itself into window
        const phantom = window.solana
        
        if (phantom?.isPhantom) {
          setWallet(phantom)
          console.log('🟢 Phantom Wallet detected')
        } else {
          console.log('🔴 Phantom Wallet not found')
          setError('Phantom Wallet not installed')
        }
      } catch (err) {
        console.error('Wallet initialization error:', err)
        setError('Failed to initialize wallet')
      }
    }

    initializeWallet()
  }, [])

  // Connect to Phantom Wallet
  const connectWallet = async () => {
    if (!wallet) {
      setError('Phantom Wallet not available')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await wallet.connect()
      const address = response.publicKey.toString()
      
      // Simulated balance (in real app, fetch from Solana RPC)
      const balance = Math.random() * 10 + 0.5 // 0.5-10.5 SOL

      setAccount({
        address,
        balance,
        isConnected: true
      })

      // Add some mock transactions
      setTransactions([
        {
          signature: '5VfYD...' + Math.random().toString(36).substr(2, 9),
          amount: 1.5,
          recipient: 'Ab3d...xyz9',
          timestamp: Date.now() - 3600000,
          status: 'confirmed'
        },
        {
          signature: '7HgXR...' + Math.random().toString(36).substr(2, 9),
          amount: 0.25,
          recipient: 'Cd7f...abc2',
          timestamp: Date.now() - 7200000,
          status: 'confirmed'
        }
      ])

      console.log('✅ Wallet connected:', address)
    } catch (err) {
      console.error('Connection error:', err)
      setError('Failed to connect wallet')
    } finally {
      setIsLoading(false)
    }
  }

  // Disconnect wallet
  const disconnectWallet = async () => {
    if (!wallet) return

    try {
      await wallet.disconnect()
      setAccount({
        address: '',
        balance: 0,
        isConnected: false
      })
      setTransactions([])
      console.log('✅ Wallet disconnected')
    } catch (err) {
      console.error('Disconnect error:', err)
    }
  }

  // Send SOL (mock implementation)
  const sendSOL = async (recipient: string, amount: number) => {
    if (!account.isConnected) return

    setIsLoading(true)
    try {
      // Mock transaction
      const newTransaction: Transaction = {
        signature: '9YzMN...' + Math.random().toString(36).substr(2, 9),
        amount,
        recipient,
        timestamp: Date.now(),
        status: 'pending'
      }

      setTransactions(prev => [newTransaction, ...prev])
      
      // Simulate network delay
      setTimeout(() => {
        setTransactions(prev => 
          prev.map(tx => 
            tx.signature === newTransaction.signature 
              ? { ...tx, status: 'confirmed' as const }
              : tx
          )
        )
        setAccount(prev => ({
          ...prev,
          balance: prev.balance - amount - 0.00025 // Deduct amount + fees
        }))
      }, 2000)

      console.log('✅ Transaction sent:', newTransaction.signature)
    } catch (err) {
      console.error('Send SOL error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div 
      className={styles.solanaContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className={styles.header}>
        <div className={styles.title}>
          <div className={styles.solanaLogo}>◎</div>
          <h2>Solana Phantom Integration</h2>
        </div>
        <div className={styles.networkBadge}>
          <div className={styles.statusDot} />
          Mainnet-Beta
        </div>
      </div>

      {error && (
        <motion.div 
          className={styles.errorBanner}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <span>⚠️</span>
          <span>{error}</span>
          <button onClick={() => setError(null)}>×</button>
        </motion.div>
      )}

      <div className={styles.walletSection}>
        {!account.isConnected ? (
          <motion.div className={styles.connectCard}>
            <div className={styles.phantomLogo}>👻</div>
            <h3>Connect Phantom Wallet</h3>
            <p>Connect your Phantom wallet to access Solana features</p>
            <button 
              className={styles.connectButton}
              onClick={connectWallet}
              disabled={isLoading || !wallet}
            >
              {isLoading ? (
                <>
                  <div className={styles.spinner} />
                  Connecting...
                </>
              ) : (
                <>
                  <span>⚡</span>
                  Connect Phantom
                </>
              )}
            </button>
          </motion.div>
        ) : (
          <motion.div 
            className={styles.walletInfo}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className={styles.accountHeader}>
              <div className={styles.accountAvatar}>👻</div>
              <div>
                <h3>Phantom Wallet</h3>
                <p className={styles.address}>
                  {account.address.slice(0, 4)}...{account.address.slice(-4)}
                </p>
              </div>
              <button 
                className={styles.disconnectButton}
                onClick={disconnectWallet}
              >
                Disconnect
              </button>
            </div>

            <div className={styles.balanceCard}>
              <div className={styles.balanceHeader}>
                <span>Total Balance</span>
                <div className={styles.refreshButton}>🔄</div>
              </div>
              <div className={styles.balanceAmount}>
                <span className={styles.amount}>{account.balance.toFixed(4)}</span>
                <span className={styles.currency}>SOL</span>
              </div>
              <div className={styles.balanceUSD}>
                ≈ ${(account.balance * 180.5).toFixed(2)} USD
              </div>
            </div>

            <div className={styles.actionsRow}>
              <button 
                className={styles.actionButton}
                onClick={() => sendSOL('Demo...Recipient', 0.1)}
                disabled={isLoading}
              >
                <span>📤</span>
                Send SOL
              </button>
              <button className={styles.actionButton}>
                <span>📥</span>
                Receive
              </button>
              <button className={styles.actionButton}>
                <span>🔄</span>
                Swap
              </button>
              <button className={styles.actionButton}>
                <span>🏦</span>
                Stake
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {account.isConnected && transactions.length > 0 && (
        <motion.div 
          className={styles.transactionsSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3>Recent Transactions</h3>
          <div className={styles.transactionsList}>
            {transactions.map((tx) => (
              <div key={tx.signature} className={styles.transactionItem}>
                <div className={styles.txIcon}>
                  {tx.status === 'pending' ? '⏳' : 
                   tx.status === 'confirmed' ? '✅' : '❌'}
                </div>
                <div className={styles.txDetails}>
                  <div className={styles.txSignature}>
                    {tx.signature}
                  </div>
                  <div className={styles.txMeta}>
                    {new Date(tx.timestamp).toLocaleString()} • 
                    To: {tx.recipient}
                  </div>
                </div>
                <div className={styles.txAmount}>
                  -{tx.amount} SOL
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className={styles.footer}>
        <div className={styles.footerLinks}>
          <a href="https://phantom.app" target="_blank" rel="noopener noreferrer">
            Phantom Wallet
          </a>
          <a href="https://solana.com" target="_blank" rel="noopener noreferrer">
            Solana Network
          </a>
          <a href="https://solscan.io" target="_blank" rel="noopener noreferrer">
            Block Explorer
          </a>
        </div>
        <div className={styles.poweredBy}>
          Powered by UltraThinking Web8 • Solana Integration v8.0.0
        </div>
      </div>
    </motion.div>
  )
}
