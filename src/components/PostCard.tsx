import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

interface PostCardProps {
  username: string;
  date: string;
  hashtags: string[];
  kcal: number;
  content: string;
  image: any;
  likes: number;
  comments: number;
}

const PostCard = ({
  username,
  date,
  hashtags,
  kcal,
  content,
  image,
  likes,
  comments,
}: PostCardProps) => {
  return (
    <View style={styles.card}>
      {/* 상단 사용자 정보 */}
      <View style={styles.header}>
        <Image
          source={require('../assets/images/profile.png')}
          style={styles.profileImage}
        />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={{ fontSize: 30 }}>⋮</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        {/* 왼쪽 이미지 */}
        <Image source={image} style={styles.postImage} />

        {/* 오른쪽 텍스트 콘텐츠 */}
        <View style={styles.rightSection}>
          {/* 텍스트 */}
          <View style={styles.textContent}>
            <Text style={styles.hashtags}>
              {hashtags.map(tag => `#${tag} `).join('')}#{kcal}kcal
            </Text>
            <Text style={styles.content}>{content}</Text>
          </View>

          {/* 좋아요/댓글 */}
          <View style={styles.footer}>
            <Image source={require('../assets/images/like.png')} style={styles.icon} />
            <Text style={styles.count}>{likes}</Text>
            <Image source={require('../assets/images/comment.png')} style={[styles.icon, { marginLeft: 16 }]} />
            <Text style={styles.count}>{comments}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 36,
  },
  header: {
    width: '100%',
    marginBottom: 12,
    flexDirection: 'row',
  },
  profileImage: {
    width: 43,
    height: 43,
    borderRadius: 22,
  },
  userInfo: {
    marginLeft: 11,
    marginTop: 2,
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  date: {
    color: '#969696',
    fontSize: 14,
  },
  menuButton: {
    paddingRight: 15,
  },
  content: {
    flexDirection: 'row',
  },
  postImage: {
    width: 157,
    height: 157,
    borderRadius: 17,
    resizeMode: 'cover',
    marginRight: 22,
    backgroundColor: '#D9D9D9'
  },
  rightSection: {
    flex: 1,
    justifyContent: 'space-between',
  },
  textContent: {
    marginBottom: 8,
  },
  hashtags: {
    color: '#38B000',
    fontWeight: 'bold',
    marginBottom: 15,
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 18,
    height: 18,
  },
  count: {
    marginLeft: 4,
    fontSize: 12,
    color: '#121212',
  },
});

export default PostCard;
