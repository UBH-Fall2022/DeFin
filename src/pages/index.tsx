import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Image from 'next/image';
import React, { FC, useCallback } from 'react';
import styles from '../styles/Home.module.css';
import { WalletError, WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import Wallet from '@project-serum/sol-wallet-adapter';
import { Button, Input, Text, Spacer, Modal, useModal, Navbar, Row, Checkbox } from "@nextui-org/react";
import { tsParticles } from "tsparticles-engine";
import Particles from "react-particles";
import type { Engine } from "tsparticles-engine";
import { loadConfettiPreset } from "tsparticles-preset-confetti";



// import Pool to access node postgresql

import { Client } from 'pg';
// reading the data from user??
/*
function storeSender(pub: PublicKey) {
    const pubKey = pub;
    const username = process.env.CRDB_USERNAME || 'liansolomon02';
    const pw = process.env.CRDB_PW|| 'Ci9XJZjU1X-m3Yvil_vfSg';
    const cluster = process.env.CRDB_CLUSTER || 'crypto-bank-2614';
    
    const database = process.env.CRDB_DATABASE  || 'defaultdb'; // database
    const host     = process.env.CRDB_HOST      || 'free-tier11.gcp-us-east1.cockroachlabs.cloud'; // cluster host
    
    // store the url for database inside connectionString
    const connectionString = 'postgresql://' + // use the postgresql wire protocol
    username +                       // username
    ':' +                            // separator between username and pw
    pw +                       // pw
    '@' +                            // separator between username/pw and port
    host +                           // host
    ':' +                            // separator between host and port
    '26257' +                        // port, CockroachDB Serverless always uses 26257
    '/' +                            // separator between port and database
    database +                       // database
    '?' +                            // separator for url parameters
    'sslmode=verify-full' +          // always use verify-full for CockroachDB Serverless
    '&' +                            // url parameter separator
    //'sslrootcert=' +      // full path to ca certificate 
    //'&' +                            // url parameter separator
    'options=--cluster%3D' + cluster // cluster name is passed via the options url parameter
    
    
    // need to create a function to store the data from users and transactions
    const client = new Client({connectionString});
    const createTable = 'CREATE TABLE userIDs (id STRING PRIMARY KEY, name STRING)';
    client.query(createTable)
    // create a new user
    client.query('INSERT INTO userIDs(id) VALUES($1)', [pubKey])
    const ID = client.query('SELECT * FROM userIDs');
    console.log(ID);
}
*/


// end of storeSender function
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
    const { setVisible, bindings } = useModal();

    const onClick = useCallback(async () => {
        if (!wallet.publicKey) throw new WalletNotConnectedError();

        // 890880 lamports as of 2022-09-01
        const lamports:number = Math.floor(Number(parseFloat((document.getElementById('Amount') as HTMLInputElement).value)*LAMPORTS_PER_SOL));
        var pub;
        if(((document.getElementById('Sender') as HTMLInputElement).value) == 'solomon'){
            pub = new PublicKey("2Zw7RNSkXGn45tkYdXaebmnGDJsxtxr1o5r31HCmkcZ1")
        } else {
            pub = new PublicKey((document.getElementById('Sender') as HTMLInputElement).value);
        }

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

        //Write a return notification saying payment succesful to Sender
        //

        (document.getElementById('Sender') as HTMLInputElement).value = '';
        (document.getElementById('Amount') as HTMLInputElement).value = '';
        // hopefully stores the user id
        //storeSender(wallet.publicKey);
    }, [wallet.publicKey, wallet.sendTransaction, connection]);

    const options = {
        preset: "confetti",
      };



    if(wallet.connected){
    return (
        <div>
            <Head>
                <title>DePay: The wallet of tommorow</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.fullmain}>
            <Particles options={options}/>
                <Navbar isBordered variant="static">
                    <Navbar.Brand>
                    <Text b color="inherit" hideIn="xs" css={{
                            textGradient: "45deg, $purple600 -20%, $pink600 100%",
                          }}>
                    DePay
                    </Text>
                    </Navbar.Brand>
                    <Navbar.Content>

                    </Navbar.Content>
                    <Navbar.Content>
                    <WalletDisconnectButtonDynamic />
                    </Navbar.Content>
                </Navbar>

                <div className={styles.container}>
                    <div className = {styles.main}>
            <Text
        h1
        size={60}
        css={{
          textGradient: "45deg, $blue600 -20%, $pink600 50%",
        }}
        weight="bold">
                    Welcome to DePay!
                </Text>

                <Spacer y={1} />
                <div className = {styles.MoneySender}>
                    <Input className={styles.input} type="text" 
                    placeholder="Who Are You Sending To?" 
                    id="Sender" 
                    bordered
                    color="secondary" 
                    width="500px"></Input>
                    </div>
                    <Spacer y={1.5} />
                    <div>
                    <Input className = {styles.input} type="text" 
                    placeholder="How Much You Sendin?" 
                    id="Amount" 
                    bordered
                    color="secondary"
                    width="500px"
                    >
                    </Input>
                    </div>
                    <Spacer y={1} />
                    <div>
                    <Button className = {styles.button} bordered auto shadow ghost color="gradient" onClick={onClick} disabled={!wallet.publicKey}>
                        Send SOL!
                    </Button>
                    </div>
                    <Spacer y={1} />
                    <div>
                    {wallet.publicKey && <Button auto flat color="secondary" onClick={() => setVisible(true)}>Public Key: {wallet.publicKey.toBase58()} </Button>}
                    <Modal
        scroll
        width="600px"
        closeButton
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        {...bindings}>
        <Modal.Header>
          <Text id="modal-title" size="$xl">
            This is your Public Key:
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Text id="modal-description" size="$sm">
            Your Public Key is your own peresonal ID used to send money into your account.
            Unlike your Private Key or your passphrase, your Public Key is safe to send to
            anyone and everyone! This Public Key might looks scary but trust me, we got it
            covered.
          </Text>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setVisible(false)}>Cool!</Button>
        </Modal.Footer>
      </Modal>
        </div>
            </div>
                </div>
                
            </main>
        </div>
    );}
    else {
        //Wallet Not Connected
        return(
            <main className={styles.fullmain}>
                                <Navbar isBordered variant="static">
                    <Navbar.Brand>
                    <Text b color="inherit" hideIn="xs" css={{
                            textGradient: "45deg, $purple600 -20%, $pink600 100%",
                          }}>
                    DePay
                    </Text>
                    </Navbar.Brand>
                    <Navbar.Content>

                    </Navbar.Content>
                    <Navbar.Content>
                    </Navbar.Content>
                </Navbar>
                <Spacer y={3} />
                <div className={styles.main}>
                    <div>
                    <Text
                        h1
                        size={60}
                        css={{
                            textGradient: "45deg, $purple600 -20%, $pink600 100%",
                          }}
                        weight="bold"
                        >
                    Welcome to <a>DePay!</a>
                </Text>
                <Text h4>A decentralized wallet that makes money easier</Text>
                    </div>
                <div className={styles.walletButtons}>
                <WalletMultiButtonDynamic />
                </div>
                

            </div>
            </main>
        )
    }
    /*
    function mapSender(pub: string) {
        pub = 'helpo me';
    }
    */
   
};

export default Home;
