import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
  email: string;
}

interface Topic {
  id: number;
  title: string;
  content: string;
  user: User;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  replyCount: number;
  upvotes: number;
  downvotes: number;
  tags: string[];
  upvotedBy: string[];
  downvotedBy: string[];
}

interface Reply {
  id: number;
  content: string;
  user: User;
  createdAt: string;
  updatedAt: string;
  upvotes: number;
  downvotes: number;
  isAcceptedAnswer: boolean;
  upvotedBy: string[];
  downvotedBy: string[];
}

const ForumTopic: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTopic();
  }, [id]);

  const fetchTopic = async () => {
    try {
      setLoading(true);
      const [topicResponse, repliesResponse] = await Promise.all([
        axios.get(`/api/forum/topics/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }),
        axios.get(`/api/forum/topics/${id}/replies`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      ]);
      
      setTopic(topicResponse.data);
      setReplies(repliesResponse.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching topic:', err);
      setError('Failed to load topic. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    
    try {
      setSubmitting(true);
      const response = await axios.post(
        `/api/forum/topics/${id}/replies`,
        { content: replyContent },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setReplies([...replies, response.data]);
      setReplyContent('');
      
      // Update reply count in topic
      if (topic) {
        setTopic({
          ...topic,
          replyCount: topic.replyCount + 1
        });
      }
    } catch (err) {
      console.error('Error submitting reply:', err);
      alert('Failed to submit reply. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVoteTopic = async (voteType: 'upvote' | 'downvote') => {
    if (!topic) return;
    
    try {
      await axios.post(
        `/api/forum/topics/${id}/vote`,
        { voteType },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Refresh topic to get updated vote counts
      fetchTopic();
    } catch (err) {
      console.error('Error voting:', err);
      alert('Failed to register vote. Please try again.');
    }
  };

  const handleVoteReply = async (replyId: number, voteType: 'upvote' | 'downvote') => {
    try {
      await axios.post(
        `/api/forum/replies/${replyId}/vote`,
        { voteType },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Refresh replies to get updated vote counts
      const response = await axios.get(`/api/forum/topics/${id}/replies`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setReplies(response.data);
    } catch (err) {
      console.error('Error voting on reply:', err);
      alert('Failed to register vote. Please try again.');
    }
  };

  const handleAcceptAnswer = async (replyId: number) => {
    try {
      await axios.post(
        `/api/forum/replies/${replyId}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Refresh replies to update accepted status
      const response = await axios.get(`/api/forum/topics/${id}/replies`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setReplies(response.data);
    } catch (err) {
      console.error('Error accepting answer:', err);
      alert('Failed to accept answer. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !topic) {
    return (
      <div className="alert alert-danger" role="alert">
        {error || 'Topic not found'}
        <div className="mt-3">
          <Link to="/forum" className="btn btn-primary">
            Back to Forum
          </Link>
        </div>
      </div>
    );
  }

  const isTopicAuthor = user?.id === topic.user.id;
  const hasUpvoted = topic.upvotedBy.includes(user?.id || '');
  const hasDownvoted = topic.downvotedBy.includes(user?.id || '');

  return (
    <div className="container">
      <div className="mb-4">
        <Link to="/forum" className="btn btn-outline-secondary">
          &larr; Back to Forum
        </Link>
      </div>

      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h4 mb-0">{topic.title}</h1>
            <div className="text-muted small">
              Posted by {topic.user.firstName} {topic.user.lastName} on {formatDate(topic.createdAt)}
            </div>
          </div>
          {isTopicAuthor && (
            <div>
              <button
                className="btn btn-outline-primary btn-sm me-2"
                onClick={() => navigate(`/forum/edit/${topic.id}`)}
              >
                Edit
              </button>
            </div>
          )}
        </div>
        <div className="card-body">
          <div className="mb-4" dangerouslySetInnerHTML={{ __html: topic.content }}></div>
          
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div className="btn-group me-3">
                <button
                  className={`btn btn-sm ${hasUpvoted ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => handleVoteTopic('upvote')}
                >
                  <i className="bi bi-hand-thumbs-up"></i>
                </button>
                <button className="btn btn-sm btn-outline-secondary" disabled>
                  {topic.upvotes - topic.downvotes}
                </button>
                <button
                  className={`btn btn-sm ${hasDownvoted ? 'btn-danger' : 'btn-outline-danger'}`}
                  onClick={() => handleVoteTopic('downvote')}
                >
                  <i className="bi bi-hand-thumbs-down"></i>
                </button>
              </div>
              
              <div className="text-muted small">
                <i className="bi bi-eye me-1"></i> {topic.viewCount} views
              </div>
            </div>
            
            <div>
              {topic.tags.map((tag) => (
                <span key={tag} className="badge bg-secondary me-1">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <h3 className="h5 mb-3">
        {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
      </h3>

      {replies.length > 0 ? (
        <div className="mb-4">
          {replies.map((reply) => {
            const isReplyAuthor = user?.id === reply.user.id;
            const canAcceptAnswer = isTopicAuthor && !isReplyAuthor;
            const hasUpvotedReply = reply.upvotedBy.includes(user?.id || '');
            const hasDownvotedReply = reply.downvotedBy.includes(user?.id || '');
            
            return (
              <div
                key={reply.id}
                className={`card mb-3 ${reply.isAcceptedAnswer ? 'border-success' : ''}`}
              >
                {reply.isAcceptedAnswer && (
                  <div className="card-header bg-success text-white">
                    <i className="bi bi-check-circle me-2"></i> Accepted Answer
                  </div>
                )}
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center">
                      <div className="me-2">
                        {reply.user.profilePictureUrl ? (
                          <img
                            src={reply.user.profilePictureUrl || "/placeholder.svg"}
                            alt={`${reply.user.firstName} ${reply.user.lastName}`}
                            className="rounded-circle"
                            width="32"
                            height="32"
                          />
                        ) : (
                          <div
                            className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white"
                            style={{ width: '32px', height: '32px' }}
                          >
                            {reply.user.firstName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div>
                          {reply.user.firstName} {reply.user.lastName}
                        </div>
                        <div className="text-muted small">
                          {formatDate(reply.createdAt)}
                        </div>
                      </div>
                    </div>
                    
                    {canAcceptAnswer && !reply.isAcceptedAnswer && (
                      <button
                        className="btn btn-outline-success btn-sm"
                        onClick={() => handleAcceptAnswer(reply.id)}
                      >
                        Accept as Answer
                      </button>
                    )}
                  </div>
                  
                  <div className="mb-3" dangerouslySetInnerHTML={{ __html: reply.content }}></div>
                  
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="btn-group">
                      <button
                        className={`btn btn-sm ${hasUpvotedReply ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => handleVoteReply(reply.id, 'upvote')}
                      >
                        <i className="bi bi-hand-thumbs-up"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-secondary" disabled>
                        {reply.upvotes - reply.downvotes}
                      </button>
                      <button
                        className={`btn btn-sm ${hasDownvotedReply ? 'btn-danger' : 'btn-outline-danger'}`}
                        onClick={() => handleVoteReply(reply.id, 'downvote')}
                      >
                        <i className="bi bi-hand-thumbs-down"></i>
                      </button>
                    </div>
                    
                    {isReplyAuthor && (
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => navigate(`/forum/reply/edit/${reply.id}`)}
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="alert alert-info mb-4">
          No replies yet. Be the first to reply!
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3 className="h5 mb-0">Your Reply</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmitReply}>
            <div className="mb-3">
              <textarea
                className="form-control"
                rows={5}
                placeholder="Write your reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || !replyContent.trim()}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Submitting...
                </>
              ) : (
                'Submit Reply'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForumTopic;