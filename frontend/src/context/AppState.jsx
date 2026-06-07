import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const AppContext = createContext();

const CONTRACT_ADDRESS = '0x17D9B370fa212CF34A95c276333e164C98121831';
const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "assetId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "employeeId",
        "type": "string"
      }
    ],
    "name": "AssetAssigned",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "assetId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "owner",
        "type": "string"
      }
    ],
    "name": "AssetCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "assetId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "owner",
        "type": "string"
      }
    ],
    "name": "AssetMarkedIdle",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "assetId",
        "type": "uint256"
      }
    ],
    "name": "AssetScrapped",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "assetId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "fromOwner",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "toOwner",
        "type": "string"
      }
    ],
    "name": "AssetTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "officer",
        "type": "address"
      }
    ],
    "name": "OfficerAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "officer",
        "type": "address"
      }
    ],
    "name": "OfficerRemoved",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "officer",
        "type": "address"
      }
    ],
    "name": "addOfficer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "assetId",
        "type": "uint256"
      }
    ],
    "name": "approveIdle",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "assetOfficers",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "assetId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "employeeId",
        "type": "string"
      }
    ],
    "name": "assignAsset",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "assetId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "ownerId",
        "type": "string"
      }
    ],
    "name": "createAsset",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "assetId",
        "type": "uint256"
      }
    ],
    "name": "getAsset",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "enum AssetManagement.AssetState",
        "name": "",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "assetId",
        "type": "uint256"
      }
    ],
    "name": "getAssetHistory",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "fromOwner",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "toOwner",
            "type": "string"
          },
          {
            "internalType": "enum AssetManagement.ActionType",
            "name": "action",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "internalType": "struct AssetManagement.AssetHistory[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "officer",
        "type": "address"
      }
    ],
    "name": "removeOfficer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "assetId",
        "type": "uint256"
      }
    ],
    "name": "scrapAsset",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "assetId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "newOwner",
        "type": "string"
      }
    ],
    "name": "transferAsset",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const generateTxHash = () => {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * 16)];
  }
  return hash;
};

const MOCK_USERS = [
  { id: '11111111', password: 'password', name: 'Ali Yılmaz', institutionalEmail: 'ali.yilmaz@istanbul.edu.tr', faculty: 'İletişim Fakültesi', role: 'dept', wallet: '0x3a4b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b' },
  { id: '22222222', password: 'password', name: 'Ayşe Demir', institutionalEmail: 'ayse.demir@istanbul.edu.tr', faculty: 'Mühendislik Fakültesi', role: 'dept', wallet: '0xf4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5' },
  { id: '33333333', password: 'password', name: 'Dr. Caner Alkan', institutionalEmail: 'caner.alkan@istanbul.edu.tr', faculty: 'İşletme Fakültesi', role: 'dept', wallet: '0x11223344556677889900aabbccddeeff00112233' },
  { id: '44444444', password: 'password', name: 'Mehmet Emin Demir', institutionalEmail: 'm.emin.demir@istanbul.edu.tr', faculty: 'İletişim Fakültesi', role: 'amo', wallet: '0xabcdef0123456789abcdef0123456789abcdef01' },
  { id: '55555555', password: 'password', name: 'Selin Kaya', institutionalEmail: 'selin.kaya@istanbul.edu.tr', faculty: 'Mühendislik Fakültesi', role: 'amo', wallet: '0x77889900aabbccddeeff00112233445566778899' },
  { id: '66666666', password: 'password', name: 'Hasan Polat', institutionalEmail: 'hasan.polat@istanbul.edu.tr', faculty: 'Kütüphane ve Dökümantasyon Daire Başkanlığı', role: 'amo', wallet: '0x99887766554433221100fedcba9876543210abcd' },
  { id: '77777777', password: 'password', name: 'Zeynep Yılmaz', institutionalEmail: 'zeynep.yilmaz@istanbul.edu.tr', faculty: 'İşletme Fakültesi', role: 'dept', wallet: '' },
  { id: '88888888', password: 'password', name: 'Ahmet Koç', institutionalEmail: 'ahmet.koc@istanbul.edu.tr', faculty: 'İşletme Fakültesi', role: 'amo', wallet: '0x88889900aabbccddeeff00112233445566778899' },
  { id: '99999999', password: 'password', name: 'Prof. Dr. Elif Şahin', institutionalEmail: 'elif.sahin@istanbul.edu.tr', faculty: 'İktisat Fakültesi', role: 'dept', wallet: '0x9999888877776666555544443333222211110000' },
  { id: '12121212', password: 'password', name: 'Fatma Yurt', institutionalEmail: 'fatma.yurt@istanbul.edu.tr', faculty: 'İktisat Fakültesi', role: 'amo', wallet: '0x1212121212121212121212121212121212121212' }
];

const INITIAL_WALLETS = MOCK_USERS.reduce((acc, u) => {
  acc[u.id] = u.wallet;
  return acc;
}, {});

const INITIAL_FACULTIES = [
  'İletişim Fakültesi',
  'Mühendislik Fakültesi',
  'İşletme Fakültesi',
  'İktisat Fakültesi',
  'Kütüphane ve Dökümantasyon Daire Başkanlığı',
  'Fen Fakültesi',
  'Tıp Fakültesi'
];

const SUPPORTED_CATEGORIES = [
  'Bilgi Teknolojileri',
  'Ofis Mobilyası',
  'Bilimsel Cihaz',
  'Laboratuvar Ekipmanı',
  'Görüntü ve Ses Cihazı',
  'Eğitim Ekipmanı',
  'Ofis Ekipmanı',
  'Tıbbi Cihaz',
  'Ağ Teknolojileri',
  'Elektronik',
  'Güvenlik Ekipmanı',
  'Taşıt',
  'Diğer'
];

const INITIAL_ASSETS = [
  {
    assetId: '10000000101',
    name: 'Bilgisayar Kasası',
    category: 'Bilgi Teknolojileri',
    description: 'Masaüstü geliştirme ve yazılım bilgisayarı.',
    ownerId: '11111111',
    ownerName: 'Ali Yılmaz',
    faculty: 'İletişim Fakültesi',
    location: 'B Blok, Kat 2, AR-GE Laboratuvarı',
    status: 'ACTIVE',
    registeredAt: '2025-03-15'
  },
  {
    assetId: '10000000102',
    name: 'Lazer Yazıcı',
    category: 'Laboratuvar Ekipmanı',
    description: 'Çift taraflı siyah-beyaz lazer yazıcı.',
    ownerId: 'amo-İletişim Fakültesi',
    ownerName: 'İletişim Fakültesi Ayniyat Yetkilisi',
    faculty: 'İletişim Fakültesi',
    location: 'A Blok, Depo 3',
    status: 'IDLE',
    registeredAt: '2024-08-22'
  },
  {
    assetId: '10000000103',
    name: 'Ofis Projektörü',
    category: 'Bilimsel Cihaz',
    description: 'Toplantı ve sunum odası için HD projeksiyon cihazı.',
    ownerId: '11111111',
    ownerName: 'Ali Yılmaz',
    faculty: 'İletişim Fakültesi',
    location: 'C Blok, Laboratuvar 105',
    status: 'ACTIVE',
    registeredAt: '2024-11-08'
  },
  {
    assetId: '10000000104',
    name: 'Mikroskop',
    category: 'Görüntü ve Ses Cihazı',
    description: 'Biyoloji laboratuvarı için temel optik mikroskop.',
    ownerId: '33333333',
    ownerName: 'Dr. Caner Alkan',
    faculty: 'İşletme Fakültesi',
    location: 'D Blok, Kat 1, Konferans Salonu',
    status: 'ACTIVE',
    registeredAt: '2025-01-20'
  },
  {
    assetId: '10000000105',
    name: 'Toplantı Masası',
    category: 'Ofis Mobilyası',
    description: '6 kişilik ahşap toplantı masası.',
    ownerId: 'amo-İşletme Fakültesi',
    ownerName: 'İşletme Fakültesi Ayniyat Yetkilisi',
    faculty: 'İşletme Fakültesi',
    location: 'D Blok, Malzeme Deposu',
    status: 'IDLE',
    registeredAt: '2023-05-15'
  },
  {
    assetId: '10000000106',
    name: 'Barkod Okuyucu',
    category: 'Bilgi Teknolojileri',
    description: 'USB bağlantılı el tipi lazer barkod okuyucu.',
    ownerId: '22222222',
    ownerName: 'Ayşe Demir',
    faculty: 'Mühendislik Fakültesi',
    location: 'E Blok, Mekatronik Laboratuvarı',
    status: 'ACTIVE',
    registeredAt: '2024-09-05'
  },
  {
    assetId: '10000000107',
    name: 'Akıllı Kürsü',
    category: 'Eğitim Ekipmanı',
    description: 'Dokunmatik ekranlı ve ses sistemli amfi kürsüsü.',
    ownerId: '99999999',
    ownerName: 'Prof. Dr. Elif Şahin',
    faculty: 'İktisat Fakültesi',
    location: 'İktisat Blok A, Amfi 1',
    status: 'ACTIVE',
    registeredAt: '2025-04-10'
  },
  {
    assetId: '10000000108',
    name: 'Fotokopi Makinesi',
    category: 'Ofis Ekipmanı',
    description: 'Yüksek hızlı renkli fotokopi ve tarayıcı ünitesi.',
    ownerId: 'amo-İktisat Fakültesi',
    ownerName: 'İktisat Fakültesi Ayniyat Yetkilisi',
    faculty: 'İktisat Fakültesi',
    location: 'İktisat Dekanlık, Depo 1',
    status: 'IDLE',
    registeredAt: '2024-12-05'
  }
];

const INITIAL_REQUESTS = [
  {
    id: 'REQ-501',
    type: 'IDLE',
    assetId: '10000000103',
    assetName: 'Ofis Projektörü',
    requestingDept: 'İletişim Fakültesi',
    requestingEmployeeId: '11111111',
    requestingEmployeeName: 'Ali Yılmaz',
    ownerDept: 'İletişim Fakültesi',
    ownerId: '11111111',
    ownerName: 'Ali Yılmaz',
    requestDate: '2026-06-01',
    status: 'Pending',
    notes: 'Deneylerin tamamlanması nedeniyle cihazın atıl havuzuna alınmasını talep ediyorum.',
    txHash: null
  },
  {
    id: 'REQ-502',
    type: 'TRANSFER',
    assetId: '10000000102',
    assetName: 'Lazer Yazıcı',
    requestingDept: 'Mühendislik Fakültesi',
    requestingEmployeeId: '22222222',
    requestingEmployeeName: 'Ayşe Demir',
    ownerDept: 'İletişim Fakültesi',
    ownerId: 'amo-İletişim Fakültesi',
    ownerName: 'İletişim Fakültesi Ayniyat Yetkilisi',
    requestDate: '2026-06-02',
    status: 'Pending',
    notes: 'Yeni AR-GE projemiz için bu yazıcıya ihtiyacımız vardır. Transferini rica ederiz.',
    txHash: null
  }
];

const INITIAL_BLOCKS = [
  {
    blockNumber: 1,
    type: 'REGISTRATION',
    assetName: 'Bilgisayar Kasası',
    assetId: '10000000101',
    prevOwnerName: '[YENİ TESCİL]',
    prevDept: '[SİSTEM DIŞI]',
    newOwnerName: 'Ali Yılmaz',
    newDept: 'İletişim Fakültesi',
    transferDate: '2025-03-15',
    txHash: '0x1a8f9c2d8e4f1a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a11',
    approvalRef: 'REF-REG-2005'
  }
];

export const AppStateProvider = ({ children }) => {
  const [walletConnected, setWalletConnected] = useState(false); // browser session state
  const [walletAddress, setWalletAddress] = useState(''); // browser active address
  const [role, setRole] = useState(null); // 'dept' | 'amo'
  const [currentDept, setCurrentDept] = useState(''); // Faculty name
  const [userProfile, setUserProfile] = useState(null);
  
  // Wallet mapping: employeeId -> walletAddress
  const [userWallets, setUserWallets] = useState(INITIAL_WALLETS);
  
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [blocks, setBlocks] = useState(INITIAL_BLOCKS);
  const [notification, setNotification] = useState(null);
  
  // Real transaction tracking states
  const [txStatus, setTxStatus] = useState('IDLE'); // 'IDLE' | 'METAMASK_APPROVAL' | 'MINING' | 'SUCCESS' | 'ERROR'
  const [activeTxHash, setActiveTxHash] = useState('');
  const [txError, setTxError] = useState('');
  const [txDetails, setTxDetails] = useState({ title: '', assetId: '', assetName: '' });

  const [networkStatus, setNetworkStatus] = useState('Sepolia Testnet');

  // Helper to fetch contract instance with signer
  const getContract = async (signer = null) => {
    if (!window.ethereum) return null;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const targetSigner = signer || (await provider.getSigner());
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, targetSigner);
  };

  // Helper to check network and switch to Sepolia (0xaa36a7 / 11155111)
  const checkAndSwitchNetwork = async () => {
    if (!window.ethereum) return false;
    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== '0xaa36a7') {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }],
          });
          setNetworkStatus('Sepolia Testnet');
          return true;
        } catch (switchError) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0xaa36a7',
                chainName: 'Sepolia Test Network',
                nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
                rpcUrls: ['https://rpc.ankr.com/eth_sepolia'],
                blockExplorerUrls: ['https://sepolia.etherscan.io']
              }]
            });
            setNetworkStatus('Sepolia Testnet');
            return true;
          }
          showNotification('Lütfen MetaMask üzerinden Sepolia ağına geçiş yapın.', 'warning');
          setNetworkStatus('Geçersiz Ağ (Sepolia Bekleniyor)');
          return false;
        }
      }
      setNetworkStatus('Sepolia Testnet');
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Web3 Listener for Account & Chain Changes
  useEffect(() => {
    if (window.ethereum) {
      // Check active chain
      window.ethereum.request({ method: 'eth_chainId' })
        .then(chainId => {
          if (chainId === '0xaa36a7') {
            setNetworkStatus('Sepolia Testnet');
          } else {
            setNetworkStatus('Geçersiz Ağ (Sepolia Bekleniyor)');
          }
        })
        .catch(() => setNetworkStatus('Sepolia Testnet'));

      // Check if accounts are already connected
      window.ethereum.request({ method: 'eth_accounts' })
        .then(async (accounts) => {
          if (accounts.length > 0) {
            const activeAddress = accounts[0].toLowerCase();
            setWalletConnected(true);
            setWalletAddress(activeAddress);
          }
        })
        .catch(err => console.error("Error fetching accounts:", err));

      const handleAccounts = (accounts) => {
        if (accounts.length > 0) {
          const activeAddress = accounts[0].toLowerCase();
          setWalletConnected(true);
          setWalletAddress(activeAddress);
          
          if (userProfile) {
            setUserProfile(prev => ({
              ...prev,
              walletAddress: activeAddress
            }));
            setUserWallets(prev => ({
              ...prev,
              [userProfile.employeeId]: activeAddress
            }));
          }
          showNotification('MetaMask cüzdanı değişti.', 'info');
        } else {
          setWalletConnected(false);
          setWalletAddress('');
          if (userProfile) {
            setUserProfile(prev => ({ ...prev, walletAddress: '' }));
          }
          showNotification('MetaMask bağlantısı kesildi.', 'warning');
        }
      };

      const handleChain = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccounts);
      window.ethereum.on('chainChanged', handleChain);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccounts);
        window.ethereum.removeListener('chainChanged', handleChain);
      };
    }
  }, [userProfile]);

  // Sync data on wallet connect
  useEffect(() => {
    if (walletConnected && walletAddress) {
      syncWithBlockchain();
    }
  }, [walletConnected, walletAddress]);

  // Read data from blockchain
  const syncAssetsWithBlockchain = async () => {
    if (!window.ethereum) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      const updatedAssets = await Promise.all(assets.map(async (asset) => {
        try {
          const result = await contract.getAsset(BigInt(asset.assetId));
          const ownerId = result[1];
          const state = Number(result[2]);

          if (ownerId && ownerId.trim() !== '') {
            let status = 'ACTIVE';
            if (state === 1) status = 'IDLE';
            else if (state === 2) status = 'SCRAPPED';

            let ownerName = asset.ownerName;
            let faculty = asset.faculty;

            if (ownerId.startsWith('amo-')) {
              const fac = ownerId.replace('amo-', '');
              ownerName = `${fac} Ayniyat Yetkilisi`;
              faculty = fac;
            } else {
              const user = MOCK_USERS.find(u => u.id === ownerId);
              if (user) {
                ownerName = user.name;
                faculty = user.faculty;
              }
            }

            return {
              ...asset,
              ownerId,
              ownerName,
              faculty,
              status,
              location: status === 'SCRAPPED' ? 'Hurda Ambarı' : asset.location,
              onChainRegistered: true
            };
          }
        } catch (err) {
          // Asset might not be created on-chain yet
        }
        return {
          ...asset,
          onChainRegistered: false
        };
      }));

      setAssets(updatedAssets);
    } catch (error) {
      console.error("Error syncing assets with blockchain:", error);
    }
  };

  const fetchBlockchainEvents = async () => {
    if (!window.ethereum) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      let events = [];
      try {
        // Query from safe block to avoid full scan timeouts on public RPCs
        events = await contract.queryFilter("*", 6500000);
      } catch (queryErr) {
        try {
          events = await contract.queryFilter("*", 0);
        } catch (err) {
          console.error("Failed to query events:", err);
          return;
        }
      }

      const parsedBlocks = await Promise.all(events.map(async (event, index) => {
        const txHash = event.transactionHash;
        const blockNumber = event.blockNumber;
        
        let transferDate = new Date().toISOString().split('T')[0];
        try {
          const block = await provider.getBlock(blockNumber);
          if (block) {
            transferDate = new Date(Number(block.timestamp) * 1000).toISOString().split('T')[0];
          }
        } catch (blockErr) {}

        const eventName = event.fragment?.name;
        const args = event.args;
        if (!args) return null;

        const assetId = args.assetId?.toString();
        const localAsset = INITIAL_ASSETS.find(a => a.assetId === assetId) || assets.find(a => a.assetId === assetId);
        const assetName = localAsset ? localAsset.name : `Cihaz ID: ${assetId}`;

        let type = '';
        let prevOwnerName = '---';
        let prevDept = '---';
        let newOwnerName = '---';
        let newDept = '---';
        let approvalRef = '';

        if (eventName === 'AssetCreated') {
          type = 'REGISTRATION';
          prevOwnerName = '[YENİ TESCİL]';
          prevDept = '[SİSTEM DIŞI]';
          const ownerId = args.owner;
          if (ownerId.startsWith('amo-')) {
            const fac = ownerId.replace('amo-', '');
            newOwnerName = `${fac} Ayniyat Yetkilisi`;
            newDept = fac;
          } else {
            const user = MOCK_USERS.find(u => u.id === ownerId);
            newOwnerName = user ? user.name : ownerId;
            newDept = user ? user.faculty : '---';
          }
          approvalRef = `REF-REG-${blockNumber}`;
        } 
        else if (eventName === 'AssetMarkedIdle') {
          type = 'IDLE_APPROVAL';
          const ownerId = args.owner;
          const fac = ownerId.replace('amo-', '');
          newOwnerName = `${fac} Ayniyat Yetkilisi`;
          newDept = fac;
          prevOwnerName = localAsset ? localAsset.ownerName : '---';
          prevDept = localAsset ? localAsset.faculty : '---';
          approvalRef = `REF-IDL-${blockNumber}`;
        } 
        else if (eventName === 'AssetTransferred') {
          type = 'TRANSFER';
          const fromId = args.fromOwner;
          const toId = args.toOwner;

          if (fromId.startsWith('amo-')) {
            const fac = fromId.replace('amo-', '');
            prevOwnerName = `${fac} Ayniyat Yetkilisi`;
            prevDept = fac;
          } else {
            const user = MOCK_USERS.find(u => u.id === fromId);
            prevOwnerName = user ? user.name : fromId;
            prevDept = user ? user.faculty : '---';
          }

          if (toId.startsWith('amo-')) {
            const fac = toId.replace('amo-', '');
            newOwnerName = `${fac} Ayniyat Yetkilisi`;
            newDept = fac;
          } else {
            const user = MOCK_USERS.find(u => u.id === toId);
            newOwnerName = user ? user.name : toId;
            newDept = user ? user.faculty : '---';
          }
          approvalRef = `REF-TRF-${blockNumber}`;
        } 
        else if (eventName === 'AssetAssigned') {
          type = 'ASSIGNMENT';
          const employeeId = args.employeeId;
          const user = MOCK_USERS.find(u => u.id === employeeId);
          newOwnerName = user ? user.name : employeeId;
          newDept = user ? user.faculty : '---';
          prevOwnerName = `${newDept} Ayniyat Yetkilisi`;
          prevDept = newDept;
          approvalRef = `REF-ASM-${blockNumber}`;
        } 
        else if (eventName === 'AssetScrapped') {
          type = 'SCRAP';
          prevOwnerName = localAsset ? localAsset.ownerName : '---';
          prevDept = localAsset ? localAsset.faculty : '---';
          newOwnerName = 'Hurda Ayrımı / İmha';
          newDept = '[HURDAYA AYRILDI]';
          approvalRef = `REF-SCP-${blockNumber}`;
        }

        if (!type) return null;

        return {
          blockNumber: index + 1,
          type,
          assetName,
          assetId,
          prevOwnerName,
          prevDept,
          newOwnerName,
          newDept,
          transferDate,
          txHash,
          approvalRef
        };
      }));

      const validBlocks = parsedBlocks.filter(b => b !== null);
      if (validBlocks.length > 0) {
        setBlocks(validBlocks);
      }
    } catch (error) {
      console.error("Error fetching blockchain events:", error);
    }
  };

  const syncWithBlockchain = async () => {
    await syncAssetsWithBlockchain();
    await fetchBlockchainEvents();
  };

  // Wrapper function to execute real transactions with loading/status UI
  const runTransaction = async (title, assetId, assetName, contractCallFn) => {
    setTxDetails({ title, assetId, assetName });
    setTxStatus('METAMASK_APPROVAL');
    setActiveTxHash('');
    setTxError('');

    try {
      const networkOk = await checkAndSwitchNetwork();
      if (!networkOk) {
        setTxStatus('ERROR');
        setTxError('Sepolia Test Ağı bağlantısı sağlanamadı.');
        return false;
      }

      if (!window.ethereum) {
        setTxStatus('ERROR');
        setTxError('MetaMask tarayıcı eklentisi bulunamadı.');
        return false;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const activeAddress = (await signer.getAddress()).toLowerCase();

      if (userProfile && userProfile.walletAddress) {
        const linkedAddress = userProfile.walletAddress.toLowerCase();
        if (activeAddress !== linkedAddress) {
          // Temporarily auto-relink the active MetaMask wallet for testing purposes
          setUserWallets(prev => ({
            ...prev,
            [userProfile.employeeId]: activeAddress
          }));
          setUserProfile(prev => ({
            ...prev,
            walletAddress: activeAddress
          }));
          showNotification(`Cüzdan adresi güncellendi: ${activeAddress.slice(0, 6)}...${activeAddress.slice(-4)}`, 'info');
        }
      }

      const contract = await getContract(signer);
      const tx = await contractCallFn(contract);
      
      setTxStatus('MINING');
      setActiveTxHash(tx.hash);

      const receipt = await tx.wait();
      setTxStatus('SUCCESS');

      setTimeout(() => {
        setTxStatus('IDLE');
      }, 4000);

      return receipt;
    } catch (error) {
      console.error("Blockchain transaction error: ", error);
      setTxStatus('ERROR');
      
      let msg = 'İşlem sırasında bir hata oluştu.';
      if (error.code === 'ACTION_REJECTED' || error.message?.includes('user rejected')) {
        msg = 'İşlem kullanıcı tarafından MetaMask üzerinden reddedildi.';
      } else if (error.reason) {
        msg = `Sözleşme Hatası: ${error.reason}`;
      } else if (error.message) {
        msg = error.message.slice(0, 150);
      }
      setTxError(msg);
      return false;
    }
  };

  const loginUser = (employeeId, password) => {
    const user = MOCK_USERS.find(u => u.id === employeeId && u.password === password);
    if (!user) {
      showNotification('Hata: Sicil No veya şifre hatalı!', 'warning');
      return false;
    }

    setRole(user.role);
    setCurrentDept(user.faculty);
    
    const linkedAddress = userWallets[user.id] || '';

    setUserProfile({
      fullName: user.name,
      employeeId: user.id,
      institutionalEmail: user.institutionalEmail,
      roleName: user.role === 'amo' ? `${user.faculty} Ayniyat Yetkilisi` : 'Fakülte Çalışanı / Akademisyen',
      status: 'Aktif',
      dept: user.faculty,
      walletAddress: linkedAddress
    });

    if (linkedAddress) {
      setWalletConnected(true);
      setWalletAddress(linkedAddress);
    } else {
      setWalletConnected(false);
      setWalletAddress('');
    }

    showNotification(`Sisteme Giriş Başarılı! Hoş geldiniz, ${user.name}`, 'success');
    return true;
  };

  const resetPassword = (email) => {
    const user = MOCK_USERS.find(u => u.institutionalEmail === email);
    if (!user) {
      showNotification('Hata: Belirtilen kurumsal e-posta adresine ait personel bulunamadı!', 'warning');
      return false;
    }
    showNotification(`Şifre sıfırlama bağlantısı kayıtlı kurumsal e-posta adresinize (${user.institutionalEmail}) gönderildi.`, 'success');
    return true;
  };

  const disconnectWallet = () => {
    setRole(null);
    setCurrentDept('');
    setUserProfile(null);
    setWalletConnected(false);
    setWalletAddress('');
    showNotification('Oturum kapatıldı.', 'info');
  };

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      showNotification('MetaMask tarayıcı eklentisi bulunamadı! Lütfen yükleyin.', 'warning');
      return;
    }
    try {
      const networkOk = await checkAndSwitchNetwork();
      if (!networkOk) return;

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        const address = accounts[0].toLowerCase();
        setWalletConnected(true);
        setWalletAddress(address);

        if (userProfile) {
          setUserWallets(prev => ({
            ...prev,
            [userProfile.employeeId]: address
          }));

          setUserProfile(prev => ({
            ...prev,
            walletAddress: address
          }));
          showNotification('MetaMask cüzdanı başarıyla hesabınızla ilişkilendirildi!', 'success');
        } else {
          showNotification('MetaMask cüzdanı bağlandı.', 'success');
        }
        
        await syncWithBlockchain();
      }
    } catch (err) {
      console.error(err);
      showNotification('Cüzdan bağlantısı başarısız oldu.', 'warning');
    }
  };

  const disconnectMetaMask = () => {
    if (userProfile) {
      setUserWallets(prev => {
        const next = { ...prev };
        delete next[userProfile.employeeId];
        return next;
      });

      setUserProfile(prev => ({
        ...prev,
        walletAddress: ''
      }));
    }

    setWalletConnected(false);
    setWalletAddress('');
    showNotification('MetaMask cüzdan bağlantısı kesildi.', 'info');
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Submit Idle Request (Off-Chain)
  const submitIdleRequest = (assetId, notes) => {
    const asset = assets.find(a => a.assetId === assetId);
    if (!asset) return;

    const exists = requests.some(r => r.assetId === assetId && r.status === 'Pending' && r.type === 'IDLE');
    if (exists) {
      showNotification('Bu varlık için zaten bekleyen bir atıl talebi bulunmaktadır.', 'warning');
      return;
    }

    const newRequest = {
      id: 'REQ-' + (500 + requests.length + 1),
      type: 'IDLE',
      assetId: asset.assetId,
      assetName: asset.name,
      requestingDept: currentDept,
      requestingEmployeeId: userProfile.employeeId,
      requestingEmployeeName: userProfile.fullName,
      ownerDept: asset.faculty,
      ownerId: asset.ownerId,
      ownerName: asset.ownerName,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      notes: notes || 'Varlık artık kullanılmıyor.',
      txHash: null
    };

    setRequests(prev => [newRequest, ...prev]);
    showNotification('Atıl bildirim talebi oluşturuldu (Ayniyat Yetkilisi Onayı Bekliyor).', 'success');
  };

  // Submit Transfer Request (Off-Chain)
  const submitTransferRequest = (assetId, notes) => {
    const asset = assets.find(a => a.assetId === assetId);
    if (!asset) return;

    const exists = requests.some(r => r.assetId === assetId && r.status === 'Pending' && r.type === 'TRANSFER' && r.requestingEmployeeId === userProfile.employeeId);
    if (exists) {
      showNotification('Bu varlık için zaten bekleyen bir transfer talebiniz bulunmaktadır.', 'warning');
      return;
    }

    const newRequest = {
      id: 'REQ-' + (500 + requests.length + 1),
      type: 'TRANSFER',
      assetId: asset.assetId,
      assetName: asset.name,
      requestingDept: currentDept,
      requestingEmployeeId: userProfile.employeeId,
      requestingEmployeeName: userProfile.fullName,
      ownerDept: asset.faculty,
      ownerId: asset.ownerId,
      ownerName: asset.ownerName,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      notes: notes || 'Ekipmanın araştırma/eğitim faaliyetlerimiz için birimimize devredilmesini talep ediyoruz.',
      txHash: null
    };

    setRequests(prev => [newRequest, ...prev]);
    showNotification('Varlık transfer talebi oluşturuldu (Mevcut Sahibi Onayı Bekliyor).', 'success');
  };

  // Submit Scrap Request (Off-Chain)
  const submitScrapRequest = (assetId, notes) => {
    const asset = assets.find(a => a.assetId === assetId);
    if (!asset) return;

    const exists = requests.some(r => r.assetId === assetId && r.status === 'Pending' && r.type === 'SCRAP');
    if (exists) {
      showNotification('Bu varlık için zaten bekleyen bir hurda talebi bulunmaktadır.', 'warning');
      return;
    }

    const newRequest = {
      id: 'REQ-' + (500 + requests.length + 1),
      type: 'SCRAP',
      assetId: asset.assetId,
      assetName: asset.name,
      requestingDept: currentDept,
      requestingEmployeeId: userProfile.employeeId,
      requestingEmployeeName: userProfile.fullName,
      ownerDept: asset.faculty,
      ownerId: asset.ownerId,
      ownerName: asset.ownerName,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      notes: notes || 'Cihazın hurdaya ayrılması talep ediliyor.',
      txHash: null
    };

    setRequests(prev => [newRequest, ...prev]);
    showNotification('Hurda talebi oluşturuldu (Ayniyat Yetkilisi Onayı Bekliyor).', 'success');
  };

  // On-Chain approveIdle
  const approveIdleRequest = async (requestId) => {
    if (!walletConnected || !userProfile || !userProfile.walletAddress) {
      showNotification('Hata: İşlemi onaylamak için lütfen önce hesabınıza bir MetaMask cüzdanı bağlayın!', 'warning');
      return;
    }

    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    const asset = assets.find(a => a.assetId === request.assetId);
    if (asset && !asset.onChainRegistered) {
      showNotification('Hata: Bu demirbaş henüz blokzincirde tescil edilmemiştir! Lütfen önce tescil işlemini gerçekleştirin.', 'warning');
      return;
    }

    const success = await runTransaction(
      'Atıl Durum Onay Tescili',
      request.assetId,
      request.assetName,
      async (contract) => {
        return contract.approveIdle(BigInt(request.assetId));
      }
    );

    if (success) {
      executeApproveIdle(requestId, success.hash);
      await syncWithBlockchain();
    }
  };

  const executeApproveIdle = (requestId, txHash) => {
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'Approved', txHash } : r));
    showNotification('Atıl talebi onaylandı ve tescil işlemi tamamlandı.', 'success');
  };

  // On-Chain transferAsset
  const approveTransferRequest = async (requestId) => {
    if (!walletConnected || !userProfile || !userProfile.walletAddress) {
      showNotification('Hata: İşlemi onaylamak için lütfen önce hesabınıza bir MetaMask cüzdanı bağlayın!', 'warning');
      return;
    }

    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    const asset = assets.find(a => a.assetId === request.assetId);
    if (asset && !asset.onChainRegistered) {
      showNotification('Hata: Bu demirbaş henüz blokzincirde tescil edilmemiştir! Lütfen önce tescil işlemini gerçekleştirin.', 'warning');
      return;
    }

    const success = await runTransaction(
      'Mülkiyet Transferi Kararı',
      request.assetId,
      request.assetName,
      async (contract) => {
        const targetOwner = `amo-${request.requestingDept}`;
        return contract.transferAsset(BigInt(request.assetId), targetOwner);
      }
    );

    if (success) {
      executeApproveTransfer(requestId, success.hash);
      await syncWithBlockchain();
    }
  };

  const executeApproveTransfer = (requestId, txHash) => {
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'Approved', txHash } : r));
    showNotification('Transfer talebi onaylandı ve mülkiyet resmi deftere kaydedildi.', 'success');
  };

  // On-Chain scrapAsset
  const approveScrapRequest = async (requestId) => {
    if (!walletConnected || !userProfile || !userProfile.walletAddress) {
      showNotification('Hata: İşlemi onaylamak için lütfen önce hesabınıza bir MetaMask cüzdanı bağlayın!', 'warning');
      return;
    }

    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    const asset = assets.find(a => a.assetId === request.assetId);
    if (asset && !asset.onChainRegistered) {
      showNotification('Hata: Bu demirbaş henüz blokzincirde tescil edilmemiştir! Lütfen önce tescil işlemini gerçekleştirin.', 'warning');
      return;
    }

    const success = await runTransaction(
      'Hurdaya Ayırma Onayı',
      request.assetId,
      request.assetName,
      async (contract) => {
        return contract.scrapAsset(BigInt(request.assetId));
      }
    );

    if (success) {
      executeApproveScrap(requestId, success.hash);
      await syncWithBlockchain();
    }
  };

  const executeApproveScrap = (requestId, txHash) => {
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'Approved', txHash } : r));
    showNotification('Hurda talebi onaylandı ve imha tescili tamamlandı.', 'success');
  };

  // Reject Request (Off-Chain)
  const rejectRequest = (requestId) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'Rejected' } : r));
    showNotification(`${request.id} nolu talep reddedildi.`, 'info');
  };

  // On-Chain createAsset
  const registerAsset = async (assetData) => {
    if (!walletConnected || !userProfile || !userProfile.walletAddress) {
      showNotification('Hata: Yeni kayıt oluşturmak için lütfen önce hesabınıza bir MetaMask cüzdanı bağlayın!', 'warning');
      return;
    }

    const success = await runTransaction(
      'Yeni Demirbaş Tescili',
      assetData.assetId,
      assetData.name,
      async (contract) => {
        return contract.createAsset(BigInt(assetData.assetId), assetData.ownerId);
      }
    );

    if (success) {
      executeRegisterAsset(assetData, success.hash);
      await syncWithBlockchain();
    }
  };

  const executeRegisterAsset = (assetData, txHash) => {
    const refNum = 'REF-REG-' + Math.floor(1000 + Math.random() * 9000);
    const dateStr = new Date().toISOString().split('T')[0];

    const newAsset = {
      assetId: assetData.assetId,
      name: assetData.name,
      category: assetData.category,
      description: assetData.description || '',
      currentDept: currentDept,
      faculty: currentDept,
      location: assetData.location || `${currentDept} Envanter Deposu`,
      registeredAt: dateStr,
      status: 'ACTIVE',
      ownerId: assetData.ownerId,
      ownerName: assetData.ownerName,
      onChainRegistered: true
    };

    setAssets(prev => {
      if (prev.some(a => a.assetId === assetData.assetId)) return prev;
      return [...prev, newAsset];
    });

    showNotification(`Yeni envanter kaydı resmi deftere kaydedildi. Ref: ${refNum}`, 'success');
  };

  // On-Chain assignAsset
  const assignAsset = async (assetId, employeeId) => {
    if (!walletConnected || !userProfile || !userProfile.walletAddress) {
      showNotification('Hata: Zimmet işlemi yapmak için lütfen önce hesabınıza bir MetaMask cüzdanı bağlayın!', 'warning');
      return false;
    }

    const employee = MOCK_USERS.find(u => u.id === employeeId && u.role === 'dept');
    if (!employee) {
      showNotification('Hata: Belirtilen sicil numarasına sahip çalışan bulunamadı!', 'warning');
      return false;
    }

    if (employee.faculty !== currentDept) {
      showNotification('Hata: Cihazı sadece kendi fakültenizdeki bir çalışana zimmetleyebilirsiniz!', 'warning');
      return false;
    }

    const asset = assets.find(a => a.assetId === assetId);
    if (!asset) return false;

    if (!asset.onChainRegistered) {
      showNotification('Hata: Bu demirbaş henüz blokzincirde tescil edilmemiştir! Lütfen önce tescil işlemini gerçekleştirin.', 'warning');
      return false;
    }

    const success = await runTransaction(
      'Zimmet Ataması Tescili',
      asset.assetId,
      asset.name,
      async (contract) => {
        return contract.assignAsset(BigInt(asset.assetId), employeeId);
      }
    );

    if (success) {
      executeAssignAsset(assetId, employeeId, success.hash);
      await syncWithBlockchain();
      return true;
    }
    return false;
  };

  const executeAssignAsset = (assetId, employeeId, txHash) => {
    const employee = MOCK_USERS.find(u => u.id === employeeId);
    showNotification(`Cihaz başarıyla ${employee ? employee.name : employeeId} adına zimmetlendi.`, 'success');
  };

  const registerExistingAsset = async (assetId) => {
    const asset = assets.find(a => a.assetId === assetId);
    if (!asset) return;

    if (!walletConnected || !userProfile || !userProfile.walletAddress) {
      showNotification('Hata: Tescil işlemi için lütfen önce hesabınıza bir MetaMask cüzdanı bağlayın!', 'warning');
      return;
    }

    const success = await runTransaction(
      'Demirbaş Tescil Kaydı',
      asset.assetId,
      asset.name,
      async (contract) => {
        return contract.createAsset(BigInt(asset.assetId), asset.ownerId);
      }
    );

    if (success) {
      setAssets(prev => prev.map(a => a.assetId === assetId ? { ...a, onChainRegistered: true } : a));
      showNotification('Cihaz başarıyla blokzincirde tescil edildi!', 'success');
      await syncWithBlockchain();
    }
  };

  const registerAllOffChainAssets = async () => {
    const unregistered = assets.filter(a => a.faculty === currentDept && !a.onChainRegistered && a.status !== 'SCRAPPED');
    if (unregistered.length === 0) {
      showNotification('Tescil edilecek yeni demirbaş bulunmamaktadır.', 'info');
      return;
    }

    showNotification(`${unregistered.length} adet demirbaş için tescil kuyruğu başlatılıyor. Lütfen MetaMask onaylarını sırayla verin.`, 'info');

    for (let asset of unregistered) {
      const success = await runTransaction(
        'Toplu Demirbaş Tescil Kaydı',
        asset.assetId,
        asset.name,
        async (contract) => {
          return contract.createAsset(BigInt(asset.assetId), asset.ownerId);
        }
      );

      if (success) {
        setAssets(prev => prev.map(a => a.assetId === asset.assetId ? { ...a, onChainRegistered: true } : a));
      } else {
        showNotification('Toplu tescil işlemi iptal edildi.', 'warning');
        break;
      }
    }
    
    await syncWithBlockchain();
  };

  const clearTxState = () => {
    setTxStatus('IDLE');
    setActiveTxHash('');
    setTxError('');
  };

  return (
    <AppContext.Provider value={{
      walletConnected,
      walletAddress,
      networkStatus,
      role,
      currentDept,
      assets,
      requests,
      blocks,
      notification,
      userProfile,
      mockUsers: MOCK_USERS,
      faculties: INITIAL_FACULTIES,
      categories: SUPPORTED_CATEGORIES,
      txStatus,
      activeTxHash,
      txError,
      txDetails,
      clearTxState,
      loginUser,
      disconnectWallet,
      connectMetaMask,
      disconnectMetaMask,
      submitIdleRequest,
      submitTransferRequest,
      submitScrapRequest,
      approveIdleRequest,
      approveTransferRequest,
      approveScrapRequest,
      rejectRequest,
      registerAsset,
      assignAsset,
      registerExistingAsset,
      registerAllOffChainAssets,
      showNotification,
      resetPassword,
      syncWithBlockchain
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
