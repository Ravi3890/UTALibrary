import {
  Col,
  message,
  Row,
  Table,
  Badge,
  Input,
  Button as AntdButton,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { DeleteBook, GetAllBooks } from "../../apicalls/books";
import Button from "../../components/Button";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";

function Home() {
  const [books, setBooks] = React.useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getBooks = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetAllBooks();
      dispatch(HideLoading());
      if (response.success) {
        setBooks(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getBooks();
  }, []);

  // Function to handle search
  const handleSearch = () => {
    const result = books.filter((book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResult(result);
  };

  return (
    <div className="mt-2">
      <div className="mb-2">
        <Input
          placeholder="Search books"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: 200, marginRight: 10 }}
        />
        <AntdButton type="primary" onClick={handleSearch}>
          Search
        </AntdButton>
      </div>
      {searchResult.length === 0 && <div>No books found.</div>}
      <Row gutter={[16, 16]}>
        {(searchResult.length > 0 ? searchResult : books).map((book) => {
          return (
            <Col
              xs={24}
              sm={24}
              md={12}
              lg={6}
              xl={6}
              key={book._id}
              onClick={() => navigate(`/book/${book._id}`)}
            >
              <Badge.Ribbon
                text={book.availableCopies > 0 ? "Available" : "Not Available"}
                color={book.availableCopies > 0 ? "green" : "red"}
              >
                <div className="rounded bg-white p-2 shadow flex flex-col gap-1">
                  <img src={book.image} height="350px" alt={book.title} />
                  <h1 className="text-md text-secondary uppercase font-bold mt-2">
                    {book.title}
                  </h1>
                </div>
              </Badge.Ribbon>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}

export default Home;
