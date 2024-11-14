import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { FaHome } from 'react-icons/fa';
import './css/Main.css';

function Search() {
    const location = useLocation();
    const navigate = useNavigate();
    const { searchData } = location.state || {}; 

    const [searchText, setSearchText] = useState('');
    const [top10, setTop10] = useState([]);
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
                    <div><h2>검색 결과</h2></div>
                    <div className="stock-list">
                        {searchData && searchData.length > 0 ? (
                            searchData.map(stock => (
                                <div key={stock.rank} className="stock-item" onClick={handleStockDetail}>
                                    <img src={stock.image} alt={stock.name} className="stock-image" />
                                    <span className="name">{stock.name}</span>
                                    <span className="price-change">
                                        <span className="change" style={{ color: stock.color }}>{stock.change}</span>
                                        <span className="price">{stock.price}</span>
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div>검색 결과가 없습니다.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Search;
