import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ForumTopic {
  id: number;
  title: string;
  content: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profilePictureUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  replyCount: number;
  upvotes: number;
  downvotes: number;
  tags: string[];
}

const Forum: React.FC = () => {
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const { token } = useAuth();

  useEffect(() => {
    fetchTopics();
    fetchTags();
  }, [selectedTag, sortBy]);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      let url = '/api/forum/topics';
      
      // Add query parameters based on filters
      const params = new URLSearchParams();
      
      if (selectedTag) {
        params.append('tag', selectedTag);
      }
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      if (sortBy === 'newest') {
        params.append('sort', 'newest');
      } else if (sortBy === 'popular') {
        params.append('sort', 'popular');
      } else if (sortBy === 'mostViewed') {
        params.append('sort', 'mostViewed');
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setTopics(response.data.content);
      setError(null);
    } catch (err) {
      console.error('Error fetching topics:', err);
      setError('Failed to load forum topics. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get('/api/forum/tags', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTags(response.data);
    } catch (err) {
      console.error('Error fetching tags:', err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTopics();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col-md-8">
          <h1 className="h3 mb-3">Forum Discussions</h1>
        </div>
        <div className="col-md-4 text-end">
          <Link to="/forum/new" className="btn btn-primary">
            New Topic
          </Link>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-8">
          <form onSubmit={handleSearch} className="d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-outline-primary">
              Search
            </button>
          </form>
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="popular">Most Popular</option>
            <option value="mostViewed">Most Viewed</option>
          </select>
        </div>
      </div>

      {tags.length > 0 && (
        <div className="mb-4">
          <div className="d-flex flex-wrap gap-2">
            <button
              className={`btn btn-sm ${selectedTag === null ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setSelectedTag(null)}
            >
              All Topics
            </button>
            {tags.map((tag) => (
              <button
                key={tag}
                className={`btn btn-sm ${selectedTag === tag ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : topics.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-5">
            <h5 className="card-title">No topics found</h5>
            <p className="card-text text-muted">
              {selectedTag
                ? `No topics found with the tag "${selectedTag}"`
                : searchQuery
                ? `No topics found matching "${searchQuery}"`
                : 'Be the first to start a discussion!'}
            </p>
            <Link to="/forum/new" className="btn btn-primary">
              Create New Topic
            </Link>
          </div>
        </div>
      ) : (
        <div className="list-group">
          {topics.map((topic) => (
            <Link
              key={topic.id}
              to={`/forum/topic/${topic.id}`}
              className="list-group-item list-group-item-action"
            >
              <div className="d-flex w-100 justify-content-between align-items-center">
                <h5 className="mb-1">{topic.title}</h5>
                <small className="text-muted">{formatDate(topic.createdAt)}</small>
              </div>
              <p className="mb-1 text-truncate">{topic.content}</p>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <small className="text-muted me-3">
                    By {topic.user.firstName} {topic.user.lastName}
                  </small>
                  <div className="d-flex gap-3">
                    <small className="text-muted">
                      <i className="bi bi-eye me-1"></i> {topic.viewCount} views
                    </small>
                    <small className="text-muted">
                      <i className="bi bi-chat me-1"></i> {topic.replyCount} replies
                    </small>
                    <small className="text-muted">
                      <i className="bi bi-hand-thumbs-up me-1"></i> {topic.upvotes - topic.downvotes} votes
                    </small>
                  </div>
                </div>
                <div>
                  {topic.tags.map((tag) => (
                    <span
                      key={tag}
                      className="badge bg-secondary me-1"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedTag(tag);
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Forum;