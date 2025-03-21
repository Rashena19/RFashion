import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import '../styles/BlogPost.css';

// Using the same blog posts data from Home page
const blogPosts = [
  {
    id: 1,
    title: 'Spring Fashion Trends 2025',
    excerpt: 'Discover the latest spring fashion trends that are taking over the runway.',
    image: '/photo1.jpeg',
    date: new Date('2025-03-18'),
    author: 'Jane Style',
    content: `Spring 2025 brings a fresh wave of fashion trends that are both innovative and sustainable. 
    From bold color combinations to eco-friendly materials, this season is all about making a statement while 
    being conscious of our environmental impact. Key trends include oversized blazers, sustainable denim, 
    and statement accessories that add personality to any outfit.`
  },
  {
    id: 2,
    title: 'Sustainable Fashion Guide',
    excerpt: 'How to build a sustainable wardrobe without compromising on style.',
    image: '/photo2.jpeg',
    date: new Date('2025-03-18'),
    author: 'Emma Eco',
    content: `Building a sustainable wardrobe doesn't mean sacrificing style. This guide explores how to 
    make conscious fashion choices that benefit both the environment and your personal style. Learn about 
    sustainable materials, ethical brands, and how to extend the life of your clothing through proper care 
    and maintenance.`
  },
  {
    id: 3,
    title: 'Summer Collection Preview',
    excerpt: 'Get a sneak peek at the hottest summer fashion trends.',
    image: '/photo3.jpeg',
    date: new Date('2025-03-18'),
    author: 'Sarah Summer',
    content: `Summer 2025 is all about bold prints, lightweight fabrics, and versatile pieces that can 
    take you from day to night. This preview highlights the key pieces you'll need in your wardrobe, 
    from breezy dresses to statement accessories that will keep you cool and stylish all season long.`
  },
  {
    id: 4,
    title: 'Street Style Inspiration',
    excerpt: 'Urban fashion trends that are making waves this season.',
    image: '/photo4.jpeg',
    date: new Date('2025-03-18'),
    author: 'Alex Urban',
    content: `Street style continues to influence high fashion, with urban trends making their way into 
    mainstream fashion. This post explores how to incorporate street style elements into your everyday 
    wardrobe, from oversized silhouettes to bold color combinations and statement accessories.`
  },
  {
    id: 5,
    title: 'Accessories Guide',
    excerpt: 'Complete your look with these must-have accessories.',
    image: '/photo5.jpeg',
    date: new Date('2025-03-19'),
    author: 'Lisa Accessories',
    content: `The right accessories can transform any outfit from ordinary to extraordinary. This guide 
    covers the essential accessories for 2025, from statement jewelry to versatile bags and shoes. Learn 
    how to mix and match accessories to create unique looks that express your personal style.`
  },
  {
    id: 6,
    title: 'Fashion Week Highlights',
    excerpt: 'The best moments from this year\'s fashion week.',
    image: '/photo6.jpeg',
    date: new Date('2025-03-17'),
    author: 'Mark Fashion',
    content: `Fashion Week 2025 brought together the world's most innovative designers and trendsetters. 
    This post highlights the most memorable moments, from groundbreaking collections to celebrity sightings 
    and the emerging trends that will shape fashion in the coming months.`
  }
];

function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    // Find the post with matching id
    const foundPost = blogPosts.find(post => post.id === parseInt(id));
    setPost(foundPost);
  }, [id]);

  if (!post) {
    return (
      <div className="container">
        <div className="error-message">Post not found</div>
      </div>
    );
  }

  return (
    <div className="container">
      <article className="post-card post-detail">
        <div className="post-image">
          <img
            src={post.image || `/photo${Math.floor(Math.random() * 3) + 1}.jpeg`}
            alt={post.title}
          />
        </div>
        <div className="post-content">
          <h1 className="post-title">{post.title}</h1>
          <p className="post-meta">
            By {post.author} • {post.date.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          </p>
          <div className="post-body">
            {post.content}
          </div>
        </div>
      </article>
    </div>
  );
}

export default BlogPost; 