// import logo from "./logo.svg";
import React from "react";
import "./App.css";
import Title from "./components/Title";

const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};
const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};

function CatItem(props) {
  return (
    <li>
      <img src={props.img} />
    </li>
  );
}
const MainCard = ({ img, onHeartClick, alreadyFavorite }) => {
  const heartIcon = alreadyFavorite ? "💖" : "🤍";
  return (
    <div className="main-card">
      <img src={img} alt="고양이" width="400" />
      <button onClick={onHeartClick}>{heartIcon}</button>
    </div>
  );
};

function Favorites({ favorites }) {
  if (favorites.length === 0) {
    return <div>사진 위 하트를 눌러 고양이 사진을 저장해봐요!</div>;
  }
  return (
    <ul className="favorites">
      {favorites.map((cat) => (
        <CatItem img={cat} key={cat} />
      ))}
    </ul>
  );
}

const Form = ({ updateMainCat }) => {
  const [value, setValue] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");
  const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);

  function handleInputChange(e) {
    const userValue = e.target.value;

    setErrorMessage("");
    if (includesHangul(userValue)) {
      setErrorMessage("한글은 입력할 수 없습니다");
    }
    setValue(userValue.toUpperCase());
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    if (value === "") {
      setErrorMessage("빈 값으로 만들 수 없습니다");
      return;
    }
    updateMainCat(value);
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        name="name"
        placeholder="영어 대사를 입력해주세요"
        value={value}
        onChange={handleInputChange}
      />
      <button type="submit">생성</button>
      <p style={{ color: "red" }}>{errorMessage}</p>
    </form>
  );
};

const App = () => {
  const CAT1 = "https://cataas.com/cat/60b73094e04e18001194a309/says/react";
  const CAT2 = "https://cataas.com//cat/5e9970351b7a400011744233/says/inflearn";
  const CAT3 =
    "https://cataas.com/cat/595f280b557291a9750ebf65/says/JavaScript";

  const [counter, setCounter] = React.useState(() => {
    return jsonLocalStorage.getItem("counter");
  });

  const [MainCatImg, setMainCatImg] = React.useState(CAT1);

  const [favorites, setFavorites] = React.useState(() => {
    return jsonLocalStorage.getItem("favorites") || [];
  });

  const alreadyFavorite = favorites.includes(MainCatImg);

  async function setInitialCat() {
    const newCat = await fetchCat("First cat");
    setMainCatImg(newCat);
  }
  React.useEffect(() => {
    setInitialCat();
  }, []);

  async function updateMainCat(value) {
    const newCat = await fetchCat(value);
    setMainCatImg(newCat);

    setCounter((prev) => {
      const nextCounter = prev + 1;
      jsonLocalStorage.setItem("counter", nextCounter);
      return nextCounter;
    });
  }

  function handleHeartClick() {
    //이름 관례가 있다. on으로 시작하면 handle~, 끝이 click 이면 Click 이런식, 그리고 prop으로 넘겨줄때는 handle을 on으로 쓸것
    const nextFavorites = [...favorites, MainCatImg];
    setFavorites(nextFavorites);
    jsonLocalStorage.setItem("favorites", nextFavorites);
  }

  const counterTitle = counter === null ? "" : counter + "번째 ";

  return (
    <div>
      <Title>{counterTitle}고양이 가라사대</Title>
      <Form updateMainCat={updateMainCat} />
      <MainCard
        img={MainCatImg}
        onHeartClick={handleHeartClick}
        alreadyFavorite={alreadyFavorite}
      />
      <Favorites favorites={favorites} />
    </div>
  );
};

export default App;
