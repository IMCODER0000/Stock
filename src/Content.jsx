import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { FaHome } from 'react-icons/fa';
import './css/Main.css';

function Content() {
    const location = useLocation();
    const navigate = useNavigate();
    const { clickStock } = location.state || {};

    const [searchText, setSearchText] = useState('');
    const [contentData, setContentData] = useState({});
    const [allData, setAllData] = useState([]);


    useEffect(() => {

        setAllData([
            { rank: 1, name: '엔비디아', change: '+1.1%', price: '195,096원', color: 'red', image: '/E.png' },
            { rank: 2, name: 'SK하이닉스', change: '+1.1%', price: '198,200원', color: 'red', image: '/SK.png' },
            { rank: 3, name: '삼성전자', change: '-4.2%', price: '56,600원', color: 'blue', image: '/SA.png' },
            { rank: 4, name: 'NAVER', change: '-0.2%', price: '172,100원', color: 'gray', image: '/N.png' },
            { rank: 5, name: '카카오', change: '-0.6%', price: '37,450원', color: 'gray', image: '/K.png' },
            { rank: 6, name: 'CJ씨푸드', change: '-2.0%', price: '3,090원', color: 'blue', image: '/C.png' },
            
        ]);

        setContentData({name: '엔비디아', change: '+1.1%', price: '195,096원', Dollar: '121.78', color: 'red', image: '/E.png'
            , intentionSell: '1,234,245', intentionBuy : '892,543', Recommendation : true, RecommendationReason:'~~~~~~',
            PBR: '...', PER: '...' 
        })
        
    }, []); 


    const handleChange = (event) => {
        setSearchText(event.target.value);
    };

    const handleSearch = () => {
        const foundData = allData.filter((data) => data.name === searchText);
        navigate('/search', { state: { searchData: foundData } });
    };

    const handleHomeClick = () => {
        navigate('/');  
    };

    const handleStockDetail = () =>{
        navigate('/stock');
    }

    return (
        <div>
            <div className="Main-total">
                <div className="Main-Content">
                    <div className="Main-Search">
                        <div>
                            <button className="home-button" onClick={handleHomeClick}>
                                <FaHome />
                            </button>
                        </div>
                        <input
                            type="text"
                            className="search-input"
                            value={searchText}
                            onChange={handleChange}
                            placeholder="검색어를 입력하세요..."
                        />
                        <button className="search-button" onClick={handleSearch}>
                            <FaSearch />
                        </button>
                    </div>
                    
                    <div>{clickStock.name}</div>
                    
                </div>
            </div>
        </div>
    );
}

export default Content;
