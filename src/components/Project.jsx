import { Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from "@metamask/detect-provider";
import { Box, Button, FormControl, MenuItem, Select } from '@mui/material';
import { useEffect, useState } from 'react';
import { convertBigNumber, convertProjectId, getAllProject, getListActiveProject, parseUnixTimeStamp } from '../utils';


function Projects() {
    const [provider, setProvider] = useState(null);
    const [isConnectMetamask, setIsConnectMetamask] = useState(false);
    const [projects, setProjects] = useState(null);
    const [currentAddress, SetCurrentAddress] = useState(0);
    const [filterProject, setFilterProject] = useState(0);


    const handleChange = (event) => {
        setFilterProject(event.target.value);
    };

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

    async function checkConnectMetamask() {
        if (typeof window.ethereum === 'undefined') {
            setIsConnectMetamask(true);
            return;
        }
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            if (!accounts || accounts.length === 0) {
                setIsConnectMetamask(true);
                return;
            }
        } catch (error) {
            setIsConnectMetamask(true);
            return;
        }
    }

    useEffect(() => {
        checkConnectMetamask();
        const init = async () => {
            console.log(provider);
            if (!provider) return;
            const handleGetProjects = async () => {
                let listProject
                if (filterProject === 0) {
                    listProject = await getAllProject(provider.getSigner())
                }
                else if (filterProject === 1) {
                    listProject = await getListActiveProject(provider.getSigner())
                }
                console.log(listProject);
                setProjects(listProject)
            }
            try {
                await handleGetProjects()
            } catch {
            }

            const getAddress = async () => {
                const addressCurrent = await provider.getSigner().getAddress();
                SetCurrentAddress(addressCurrent)
            }
            try {
                await getAddress()
            } catch {
            }
        }
        init()
    }, [provider]);
    return (
        <>
            <div className="fixed z-30 w-full bg-white shadow-xl">
                <div className="px-8 flex justify-between ">
                    <div className="flex items-center">
                        <a href="/">
                            <img className="w-26 h-12 mr-10 text-gray-700" src="/350232362_194904190170121_8724430467209331448_n.png" alt="logo" />
                        </a>
                    </div>
                    <div className="flex items-center">
                        <a className='mx-2 px-2 py-4 text-lg' href='/'>TRANG CHỦ</a>
                        <a style={{ "color": "#49A942" }} className='mx-2 px-2 py-4 text-lg' href='/projects'> CÁC DỰ ÁN</a>
                        <a className='mx-2 px-2 py-4 text-lg' href='/profile'>THÔNG TIN CỦA BẠN</a>
                        <a className='mx-2 px-2 py-4 text-lg' href='/contact-us'>LIÊN HỆ VỚI CHÚNG TÔI</a>
                        <a className='mx-2 px-2 py-4 text-lg' href='/about'>VỀ CHÚNG TÔI</a>
                        {/* <a href="/donate">
              <button className="px-8 py-3 bg-green-700  text-white font-bold">DONATE</button>
            </a> */}
                    </div>
                </div>
            </div>
            <div className='relative sm:container mx-auto px-10 pt-32'>
                {currentAddress === '0x63Bb4B859ddbdAE95103F632bee5098c47aE2461' &&
                    <div className='flex justify-end mb-6'>
                        <Button href='/projects/add' variant="outlined">Thêm mới dự án</Button>
                    </div>
                }

                <div className='flex justify-between'>
                    <h1 className='font-bold text-3xl'>Danh sách các dự án</h1>
                    <Box sx={{ minWidth: 220 }}>
                        <FormControl fullWidth>
                            {/* <InputLabel id="demo-simple-select-label">Age</InputLabel> */}
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={filterProject}
                                // label="Lọc"
                                onChange={handleChange}
                            >
                                <MenuItem value={0}>Tất cả dự án</MenuItem>
                                <MenuItem value={1}>Dự án đang mở ủng hộ</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </div>
                {projects?.map((item) => {
                    return <a key={convertProjectId(item.projectId)} href={`project-detail/${convertProjectId(item.projectId)}`}>
                        <div className='flex m-4 p-4'>
                            <img className='w-40' src={item.imageUrl} alt="" />
                            <div className='ml-4'>
                                <h2 className='font-bold text-lg'>{item.title}</h2>
                                <p>{item.objective}</p>
                                <div>
                                    <div>Mục tiêu: {convertBigNumber(item.amount)} <span className='font-bold'>USD</span></div>
                                    <div className='flex'>
                                        <p>Tiến độ:</p>
                                        <p className='ml-2'>
                                            {(convertBigNumber(item && item.totalDonations) / convertBigNumber(item && item.amount)) * 100 > 100 ?
                                                100 : ((convertBigNumber(item.totalDonations) / convertBigNumber(item.amount)) * 100).toFixed(1)
                                            }
                                            %
                                        </p>
                                    </div>
                                    <div>Thời điểm ngừng kêu gọi: {parseUnixTimeStamp(item.deadline)}</div>
                                </div>
                            </div>
                        </div>
                    </a>

                })}
            </div>
            <div className='py-8 px-44 h-82 bg-black'>
                <div>
                    <div className='flex justify-around'>
                        <div className=''>
                            <div className='w-64'>
                                <a href="/">
                                    <img className="w-26 h-12 mr-10 text-gray-700" src="/350232362_194904190170121_8724430467209331448_n.png" alt="logo" />
                                </a>
                            </div>
                            <div className='mt-4 text-white text-xs w-96'>
                                Chào mừng bạn đến với tổ chức quyên góp quỹ thiện nguyện! Chúng tôi cam kết xây dựng một thế giới tốt đẹp hơn thông qua những hành động thiện nguyện. Với sứ mệnh hỗ trợ cộng đồng và giúp đỡ những người gặp khó khăn, chúng tôi tập trung vào việc gây quỹ và chia sẻ tài nguyên để tạo ra những tác động tích cực. Hãy cùng nhau chung tay để thay đổi cuộc sống và lan tỏa tình yêu thương đến tất cả mọi người.
                            </div>
                            <div className='mt-8 text-white text-xs'>
                                © 2023-Quyên góp vì môi trường
                            </div>
                        </div>
                        <div>
                            <h3 className='text-white'>Kết Nối</h3>
                            <div className='mt-4'>
                                <div className='text-white text-xs'>Giới thiệu</div>
                                <div className='text-white text-xs'>Liên hệ với chúng tôi</div>
                            </div>
                        </div>
                        <div>
                            <h3 className=' text-white'>Ủng Hộ</h3>
                            <div className='mt-4'>
                                <div className='text-white text-xs'>Dự án</div>
                                <div className='text-white text-xs'>Ủng hộ</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

        </>
    );
}

export default Projects;  