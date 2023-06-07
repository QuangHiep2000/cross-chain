import { Web3Provider } from '@ethersproject/providers';
import { Tab, Tabs } from '@material-ui/core';
import { TabContext } from '@material-ui/lab';
import detectEthereumProvider from "@metamask/detect-provider";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PaidIcon from '@mui/icons-material/Paid';
import CircularProgress from '@mui/joy/CircularProgress';
import { Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { convertBigNumber, getListWithdrawProject, getProjectDetail, parseUnixTimeStamp } from '../utils';
import FormDonate from './FormDonate';


function ProjectDetail() {
    const [provider, setProvider] = useState(null);
    const [value, setValue] = useState(0);
    const [currentAddress, setCurrentAddress] = useState(0);
    const [project, setProject] = useState(null);
    const { param } = useParams();
    const [listWithdraw, setListWithdraw] = useState([]);
    const handleChange = (event, newValue) => {
        localStorage.setItem("tab", newValue);
        setValue(newValue);
    };
    useEffect(() => {
        const init = async () => {
            const ethereumProvider = await detectEthereumProvider();
            if (!ethereumProvider) {
                console.error("Không tìm thấy MetaMask");
                return;
            }
            const provider = new Web3Provider(ethereumProvider);
            setProvider(provider)
            const network = await provider.getNetwork();
            const chainid = network.chainId;
            if (chainid === 0) setValue(0)
            else if (chainid === 56) setValue(1)
            else {
                const checkTabStorage = localStorage.getItem("tab");
                setValue(checkTabStorage ? checkTabStorage : 0)
            }
        };
        init();
    }, []);

    useEffect(() => {
        if (!provider) return;
        const init = async () => {
            const signer = provider.getSigner()
            const getAddress = async () => {
                const addressCurrent = await signer.getAddress();
                setCurrentAddress(addressCurrent)
            }
            const project = await getProjectDetail(signer, param)
            setProject(project)
            await getAddress()
            const listWithdraw = await getListWithdrawProject(provider.getSigner(), param)
            setListWithdraw(listWithdraw)
            // const listOrganization = await getOrganizationsProject(signer)
        }
        init()

    }, [provider]);

    console.log(project && (convertBigNumber(project && project.totalDonations) / convertBigNumber(project && project.amount)) * 100);
    console.log(project && (convertBigNumber(project && project.totalDonations) / convertBigNumber(project && project.amount)) * 100);

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
                        <a style={{ "color": "#15803D" }} className='mx-2 px-2 py-4 text-lg' href='/projects'> CÁC DỰ ÁN</a>
                        <a className='mx-2 px-2 py-4 text-lg' href='/profile'>THÔNG TIN CỦA BẠN</a>
                        <a className='mx-2 px-2 py-4 text-lg' href='/contact-us'>LIÊN HỆ VỚI CHÚNG TÔI</a>
                        <a className='mx-2 px-2 py-4 text-lg' href='/about'>VỀ CHÚNG TÔI</a>
                        {/* <a href="/donate">
              <button className="px-8 py-3 bg-green-700  text-white font-bold">DONATE</button>
            </a> */}
                    </div>
                </div>
            </div>
            <div className='relative sm:container mx-auto px-10 pt-28'>
                <div className="flex px-5 xl:px-38 md:px-16 sm:px-16">
                    <div className="mx-10">
                        <div className="border-t-4 border-green-700 pt-8">
                            <Box
                                sx={{
                                    boxShadow: 2,
                                    display: "flex",
                                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : '#fff'),
                                    color: (theme) =>
                                        theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
                                    p: 1,
                                    m: 1,
                                    borderRadius: 2,
                                    textAlign: 'center',
                                    fontSize: '0.875rem',
                                    fontWeight: '700',
                                }}
                            >
                                <img className='w-full' src={project && project.imageUrl} alt="Nature slice" />
                                <div className='flex flex-col'>
                                    <h1 className="text-3xl mx-6 my-6 text-center">{project && project.title}</h1>
                                    <div className="mx-8 text-base">
                                        {project && project.objective}
                                    </div>
                                </div>
                            </Box>
                        </div>
                        <div className='flex my-10 justify-between'>
                            <div className='w-full'>
                                <TabContext >
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        {/* <h4 className="text-base font-bold text-green-700">ENTER YOUR GIFT AMOUNT</h4> */}
                                        <Tabs
                                            value={Number(value)}
                                            onChange={handleChange}
                                            variant="fullWidth"
                                            scrollButtons={false}
                                            aria-label="basic tabs example"
                                            TabIndicatorProps={{
                                                style: {
                                                backgroundColor: "#15803D"
                                                },
                                            }}
                                        >
                                            <Tab label="Nền tảng Ethereum" value={0} />
                                            <Tab label="Nền tảng Binance smart chain" value={1} />
                                            <Tab label="Ủng hộ của bạn" value={2} />
                                            {currentAddress === '0x63Bb4B859ddbdAE95103F632bee5098c47aE2461' &&
                                                <Tab label="Rút tiền" value={3} />
                                            }
                                        </Tabs>
                                    </Box>
                                    <FormDonate projectId={param} checkTab={Number(value)} />
                                </TabContext >
                            </div>
                            <div className='ml-16 flex flex-col items-center mt-12'>
                                <div className="xl:mx-10 mx-4 md:mx-4 sm:mx-4">
                                    <div className="flex flex-col items-center">
                                        {project &&
                                            (convertBigNumber(project && project.totalDonations) / convertBigNumber(project && project.amount)) * 100 > 100 ?
                                            <CircularProgress thickness={14} color='success' sx={{ '--CircularProgress-size': '160px' }} determinate value={100}>
                                                {100}%
                                            </CircularProgress> :
                                            <CircularProgress
                                                thickness={14} 
                                                color='success' 
                                                sx={{ '--CircularProgress-size': '160px' }}
                                                size="lg" 
                                                determinate
                                                value={(convertBigNumber(project && project.totalDonations) / convertBigNumber(project && project.amount)) * 100}
                                            > 
                                                {`${project ? (((convertBigNumber(project && project.totalDonations) / convertBigNumber(project && project.amount)) * 100).toFixed(1)) : 0}%`} 
                                            </CircularProgress>
                                        }
                                    </div>
                                </div>
                                {project && <div className='mt-10'>
                                    <div>
                                        <PaidIcon sx={{ marginRight: '4px' }} color='success' />
                                        {convertBigNumber(project.totalDonations).toFixed(4)}
                                        <span className=' ml-2 font-bold'>USDT</span>
                                    </div>
                                    <div className='mt-3'>
                                        <CalendarMonthIcon sx={{ marginRight: '4px' }} color='success' />
                                        {parseUnixTimeStamp(project && project.deadline)}
                                    </div>
                                </div>}
                            </div>
                        </div>
                        <div className='flex'>
                            <div className='border-t-4 border-green-700 flex-1 mr-5 px-5'>
                                <h2 className='my-6 text-xl font-bold'>Lịch sử rút token</h2>
                                {listWithdraw.length > 0 ? <div>
                                    <div className='pt-4 pb-1 flex justify-center border-gray-300'
                                        style={{ borderTop: '1px', borderRight: '1px', borderLeft: '1px', borderWidth: '1px' }}
                                    >
                                        <p className='w-64 font-bold text-lg'>Amount</p>
                                        <p className='w-80 font-bold text-lg'>Timestamp</p>
                                    </div>
                                    {listWithdraw.map((item, index) => {
                                        return <div
                                            key={index}
                                            className='p-3 flex justify-center border-gray-300'
                                            style={{ borderTop: '1px', borderRight: '1px', borderLeft: '1px', borderWidth: '1px' }}
                                        >
                                            <p className='w-64 font-medium text-green-700 text-lg'>{convertBigNumber(item.amount).toFixed(4)} USD</p>
                                            <p className='w-80 font-medium text-green-700 text-lg'>{parseUnixTimeStamp(item.timestamp)}</p>
                                        </div>
                                    })}
                                </div> :
                                    <div className='mt-6 text-center'>
                                        Chưa có thông tin
                                    </div>
                                }

                            </div>
                            <div className="border-t-4 border-green-700 mb-10 flex-1 ml-5 px-5">
                                <div className='my-6 flex justify-between items-center'>
                                    <h2 className='text-xl font-bold'>Các Tổ Chức Cùng Đồng Hành</h2>
                                    {currentAddress === '0x63Bb4B859ddbdAE95103F632bee5098c47aE2461' &&
                                        <Button color="success" href='/organization-add' variant="outlined">Thêm Tổ Chức</Button>
                                    }
                                </div>
                                <div className='text-center'>Chưa có thông tin</div>
                                {/* <div className='mt-4'>
                                    <h3 className='text-xl font-bold'>1. VietComBank</h3>
                                    <div className='flex items-start  mt-4'>
                                        <img className='w-40' src="https://admin.tamlyvietphap.vn/uploaded/Images/Original/2020/10/16/logo_vietcombank_1610091313.jpg" alt="" />
                                        <p className='ml-6'>Ngân hàng TMCP Ngoại thương Việt Nam tên viết tắt: "Vietcombank", là công ty lớn nhất trên thị trường chứng khoán Việt Nam tính theo vốn hóa. Hiện tại Ngân hàng nhà nước Việt Nam nắm giữ 75% cổ phần và là cổ đông lớn nhất.</p>
                                    </div>
                                </div>
                                <div className='mt-4'>
                                    <h3 className='text-xl font-bold'>2. BIDV</h3>
                                    <div className='flex items-start  mt-4'>
                                        <img className='w-40' src="https://cdn.tgdd.vn/2020/03/GameApp/image(14)-200x200-1.png" alt="" />
                                        <p className='ml-6'>Ngân hàng TMCP Đầu tư và Phát triển Việt Nam tên gọi tắt: "BIDV", là ngân hàng thương mại lớn nhất Việt Nam tính theo quy mô tài sản năm 2019 và là doanh nghiệp đứng thứ 10 trong danh sách 1000 doanh nghiệp đóng thuế thu nhập doanh nghiệp lớn nhất năm 2018.</p>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>

                </div>
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

export default ProjectDetail;  