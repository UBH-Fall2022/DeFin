import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Image from 'next/image';
import React, { FC, useCallback } from 'react';
import styles from '../styles/Home.module.css';
import { WalletError, WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction, PublicKey } from '@solana/web3.js';
import Wallet from '@project-serum/sol-wallet-adapter';


const WalletDisconnectButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletDisconnectButton,
    { ssr: false }
);
const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);


const Home: NextPage = () => {
    const {connection} = useConnection();
    const wallet = useWallet();

    const onClick = useCallback(async () => {
        if (!wallet.publicKey) throw new WalletNotConnectedError();

        // 890880 lamports as of 2022-09-01
        const lamports:number = Math.floor(Number(parseFloat((document.getElementById('Amount') as HTMLInputElement).value)*890880));
        const pub = new PublicKey((document.getElementById('Sender') as HTMLInputElement).value);

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: wallet.publicKey,
                toPubkey: pub,
                lamports,
            })
        );

        const {
            context: { slot: minContextSlot },
            value: { blockhash, lastValidBlockHeight }
        } = await connection.getLatestBlockhashAndContext();

        const signature = await wallet.sendTransaction(transaction, connection, { minContextSlot });

        await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });
    }, [wallet.publicKey, wallet.sendTransaction, connection]);

    if(wallet.connected){
    return (
        <div className={styles.container}>
            <Head>
                <title>Create Next App</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    Hey, it's <a>DePay!</a> {}
                </h1>

                <div className={styles.walletButtons}>
                    <WalletDisconnectButtonDynamic />
                </div>
                <div>
                    <input type="text" placeholder="Who Are You Sending To?" id="Sender"></input>
                    <input type="text" placeholder="How Much You Sendin?" id="Amount"></input>
                    <button onClick={onClick} disabled={!wallet.publicKey}>
                        Send SOL to a random address!
                    </button>
                </div>
                <div>
                    {wallet.publicKey && <p>Public Key: {wallet.publicKey.toBase58()}</p>}
                </div>

                <div className={styles.grid}>
                    <a href="https://nextjs.org/docs" className={styles.card}>
                        <h2>Learn More &rarr;</h2>
                        <p>Wanna know moer about DePay? Click here to learn more!</p>
                    </a>

                    <a href="https://nextjs.org/learn" className={styles.card}>
                        <h2>Learn &rarr;</h2>
                        <p>Learn about DePay in an interactive course with quizzes!</p>
                    </a>

                    <a href="https://github.com/vercel/next.js/tree/master/examples" className={styles.card}>
                        <h2>Examples &rarr;</h2>
                        <p>Discover and deploy boilerplate example Next.js projects.</p>
                    </a>

                    <a
                        href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                        className={styles.card}
                    >
                        <h2>Deploy &rarr;</h2>
                        <p>Instantly deploy your Next.js site to a public URL with Vercel.</p>
                    </a>
                </div>
            </main>

            <footer className={styles.footer}>
                <a
                    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Powered by{' '}
                    <span className={styles.logo}>
                        <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
                    </span>
                </a>
            </footer>
        </div>
    );}
    else {
        //Wallet Not Connected
        return(
            <div className={styles.walletButtons}>
                    <WalletMultiButtonDynamic />
                </div>
        )
    }
};

export default Home;
