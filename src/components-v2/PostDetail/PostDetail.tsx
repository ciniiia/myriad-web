import React, {useState} from 'react';
import {FacebookProvider, EmbeddedPost} from 'react-facebook';
import ReactMarkdown from 'react-markdown';

import Link from 'next/link';
import {useRouter} from 'next/router';

import {Button, Typography} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';

import LinkifyComponent from '../../components/common/Linkify.component';
import ShowIf from '../../components/common/show-if.component';
import {Post} from '../../interfaces/post';
import {Gallery} from '../atoms/Gallery';
import {PostActionComponent} from '../atoms/PostAction';
import {HeaderComponent} from '../atoms/PostHeader';
import {TabsComponent} from '../atoms/Tabs';
import {Video} from '../atoms/Video';
import {useStyles} from './PostDetail.styles';
import {useCommentTabs, CommentTabs} from './hooks/use-comment-tabs';

import remarkGFM from 'remark-gfm';
import remarkHTML from 'remark-html';
import {v4 as uuid} from 'uuid';

type PostDetailListProps = {
  post: Post;
};

export const PostDetail: React.FC<PostDetailListProps> = props => {
  const styles = useStyles();
  const router = useRouter();

  const {post} = props;
  const tabs = useCommentTabs(post.comments);
  const [activeTab, setActiveTab] = useState<CommentTabs>('discussion');
  const [, setDownvoting] = useState(false);

  const onHashtagClicked = async (hashtag: string) => {
    await router.push(`/home?tag=${hashtag.replace('#', '')}&type=trending`, undefined, {
      shallow: true,
    });
  };

  const handleUpvote = async () => {
    // code
  };

  const handleDownVote = async () => {
    setDownvoting(true);
    setActiveTab('debate');
  };

  const handleChangeTab = (tab: string) => {
    setActiveTab(tab as CommentTabs);
  };

  return (
    <Paper square className={styles.root}>
      <HeaderComponent post={post} />

      <div className={styles.content}>
        <ShowIf condition={post.platform === 'myriad'}>
          <Typography variant="body1" color="textPrimary" component="p">
            {post.text}
          </Typography>

          <div className={styles.tags}>
            {post.tags.map(tag => (
              <div style={{marginRight: 4, display: 'inline-block'}} key={uuid()}>
                <Link href={`?tag=${tag}&type=trending`} shallow={true}>
                  <a href={`?tag=${tag}&type=trending`}>#{tag}</a>
                </Link>
              </div>
            ))}
          </div>
        </ShowIf>

        <ShowIf condition={['twitter'].includes(post.platform)}>
          <LinkifyComponent
            text={post.text}
            handleClick={onHashtagClicked}
            variant="body1"
            color="textPrimary"
          />
        </ShowIf>

        <ShowIf condition={['reddit'].includes(post.platform)}>
          {post.title && (
            <LinkifyComponent
              text={post.title}
              handleClick={onHashtagClicked}
              variant="h4"
              color="textPrimary"
            />
          )}

          <ReactMarkdown skipHtml remarkPlugins={[remarkGFM, remarkHTML]}>
            {post.text}
          </ReactMarkdown>
        </ShowIf>

        <ShowIf condition={post.platform === 'facebook'}>
          <FacebookProvider appId={'1349208398779551'}>
            <EmbeddedPost href={post.url} width="700" />
          </FacebookProvider>
        </ShowIf>

        {post.asset?.images && post.asset?.images.length > 0 && (
          <Gallery
            images={[
              {
                medium: 'https://res.cloudinary.com/dsget80gs/lhyhjgd8v46cxeqzw5tp.png',
                small: 'https://res.cloudinary.com/dsget80gs/lhyhjgd8v46cxeqzw5tp.png',
                thumbnail: 'https://res.cloudinary.com/dsget80gs/lhyhjgd8v46cxeqzw5tp.png',
                large: 'https://res.cloudinary.com/dsget80gs/lhyhjgd8v46cxeqzw5tp.png',
              },
            ]}
            onImageClick={console.log}
          />
        )}

        {post.asset?.videos && post.asset.videos.length > 0 && <Video url={post.asset.videos[0]} />}
      </div>

      <div className={styles.action}>
        <PostActionComponent
          metrics={post.metric}
          onUpvote={handleUpvote}
          onDownVote={handleDownVote}
        />

        <Button variant="contained" color="secondary" size="small">
          Send Tip
        </Button>
      </div>

      <TabsComponent tabs={tabs} active={activeTab} onChangeTab={handleChangeTab} />
    </Paper>
  );
};
