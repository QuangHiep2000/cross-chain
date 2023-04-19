import { Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from 'ethers';
import React, { useEffect, useState } from "react";
import Header from './Header'
import { getBalance } from "../utils"

function FormDonate() {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [listMyDonate, SetListMyDonate] = useState([]);
    const [yourDonations, SetyourDonations] = useState(0);
    const [amountCrossChain, setAmountCrossChain] = useState('');
    const [amountDonateETH, setAmountDonateETH] = useState('');
    const [amountDonateBNB, setAmountDonateBNB] = useState('');
    const [amountWithdrawUSDT, setAmountWithdrawUSDT] = useState('');

    useEffect(() => {
        const init = async () => {
            const ethereumProvider = await detectEthereumProvider();
            if (!ethereumProvider) {
                console.error("Không tìm thấy MetaMask");
                return;
            }

            setProvider(new Web3Provider(ethereumProvider));

            ethereumProvider.on("chainChanged", () => {
                window.location.reload();
            });

            ethereumProvider.on("accountsChanged", () => {
                window.location.reload();
            });
        };

        init();
    }, []);
    useEffect(() => {
        if (!provider) return;
        setSigner(provider.getSigner());
        const init = async () => {
            const [testGetBalance, yourDonations] = await getBalance(provider.getSigner(), provider, 3)
            SetListMyDonate(testGetBalance)
            SetyourDonations(yourDonations)
        }

        init()
    }, [provider]);
    return (
        <div>
            <Header />
            <div className="flex px-5 xl:px-38 md:px-16 sm:px-16 mt-14">
                <div className="mx-10">
                    <div className="border-t-4 border-green-700 mb-6">
                        <h1 className="text-3xl my-6"
                            style={{
                                fontFamily: 'Chronicle Text G2 A,Chronicle Text G2 B,ui-serif,Georgia,Cambria,Times New Roman,Times,serif'
                            }}
                        >Donate Now to Protect Nature</h1>
                        <div className="flex">
                            <div className="text-lg">
                                <p>Stand up for our natural world with The Nature Conservancy. Every acre we protect, every river mile restored, every species brought back from the brink, begins with you. Your support will help take action on the ground in all 50 states and more than 70 countries.</p>
                                <p className="font-bold mt-4">FREE! Get 1 year of the award winning Nature Conservancy Magazine with membership.</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="pb-4 text-base font-bold text-green-700 border-gray-300"
                            style={{ borderTop: '1px', borderRight: '1px', borderLeft: '1px', borderWidth: '1px' }}
                        >ENTER YOUR GIFT AMOUNT</h4>
                        <div className='font-bold pt-4 text-lg'>
                            YOUR TOTAL DONATE: <span className='text-green-700 text-xl'>{yourDonations.toFixed(2)} USDT</span>
                        </div>
                        <div>
                            <div className='pt-4 pb-1 flex justify-center border-gray-300'
                                style={{ borderTop: '1px', borderRight: '1px', borderLeft: '1px', borderWidth: '1px' }}
                            >
                                <p className='w-64 font-bold text-lg'>Amount</p>
                                <p className='w-80 font-bold text-lg'>Timestamp</p>
                            </div>
                            {listMyDonate && listMyDonate.map((item, index) => {
                                return <div
                                    key={index}
                                    className='p-3 flex justify-center border-gray-300'
                                    style={{ borderTop: '1px', borderRight: '1px', borderLeft: '1px', borderWidth: '1px' }}
                                >
                                    <p className='w-64 font-medium text-green-700 text-lg'>{Number(item.amount).toFixed(2)} USDT</p>
                                    <p className='w-80 font-medium text-green-700 text-lg'>{item.timeStamp}</p>
                                </div>
                            })}
                        </div>
                    </div>
                </div>
                <div className="xl:mx-10 mx-4 md:mx-4 sm:mx-4">
                    <img src="/WOPA060426.png" alt="WOPA060426" />
                </div>
            </div>
        </div>

    );
}

export default FormDonate;  