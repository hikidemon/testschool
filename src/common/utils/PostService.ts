import { AxiosService, API_CONFIG } from './AxiosService'
import type { ServiceResponseType } from './AxiosService'
import { ElNotification } from 'element-plus'
import { ref } from 'vue'
import type { Post } from '@/common/types/Post'
import { authService } from './AuthService'
import axios from 'axios'

const VK_ACCESS_TOKEN = '8226288882262888822628886b810c52948822682262888e59105cea123ef13a6f6328e'
const VK_GROUP_ID = 'izumrudnij'

export class PostService extends AxiosService {
  constructor() {
    super(API_CONFIG)
  }

  async getVKPosts(): Promise<Post[]> {
    try {
      const allPosts: Post[] = []
      let offset = 0
      const countPerRequest = 100
      let totalCount = 0

      do {
        const response = await axios.get('https://api.vk.com/method/wall.get', {
          params: {
            owner_id: '-25496721',
            access_token: VK_ACCESS_TOKEN,
            v: '5.131',
            count: countPerRequest,
            offset: offset
          }
        })

        if (response.data.error) {
          throw new Error(response.data.error.error_msg)
        }

        const res = response.data.response

        if (offset === 0) {
          totalCount = res.count
        }

        const postsBatch = res.items.map((post: any) => {
          const image = post.attachments
            ?.filter((attachment: any) => attachment.type === 'photo')
            .map((attachment: any) => attachment.photo.sizes.pop()?.url)
            .filter((url: string) => url) || []
  
          return {
            id: post.id,
            title: '',
            content: post.text,
            image, 
            date: new Date(post.date * 1000).toISOString(),
            type: 'news',
          }
        })
        allPosts.push(...postsBatch)

        offset += countPerRequest
      } while (offset < totalCount)

      return allPosts
    } catch (error) {
      console.error('Ошибка при загрузке постов из ВК:', error)

      return []
    }
  }

  async getPosts(): ServiceResponseType<Post[]> {
    return this.axiosCall<Post[]>({
      method: 'GET',
      url: '/posts'
    })
  }

  async getAllPosts(): Promise<Post[]> {
    let localPosts: Post[] = []

    try {
      const [localError, localResponse] = await this.getPosts()

      if (!localError && localResponse?.data?.data) {
        localPosts = localResponse.data.data
      } else {
        console.warn('Локальные посты не загружены, используем только посты из VK')
      }
    } catch (error) {
      console.error('Ошибка при загрузке локальных постов:', error)
    }

    const vkPosts = await this.getVKPosts()
    if (localPosts.length === 0) {
      return this.getTestPosts()
    }

    return [...localPosts, ...vkPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  private getTestPosts(): Post[] {
    return [
      {
        id: 1,
        title: 'Тестовый пост 1',
        content: 'Это первый тестовый пост. Здесь может быть много текста.',
        image: ['https://via.placeholder.com/300'],
        type: 'event',
        date: '2025-10-01',
        area: 'Москва',
        eventdate: '2025-10-01',
        time: '19:00',
      },
      {
        id: 2,
        title: 'Тестовый пост 2',
        content: 'Это второй тестовый пост. Здесь тоже может быть много текста.',
        image: ['https://via.placeholder.com/300'],
        type: 'event',
        date: '2025-10-02',
        area: 'Санкт-Петербург',
        eventdate: '2025-10-01',
        time: '19:00',


      },
    ]
  }
  async getPostById(id: number): ServiceResponseType<Post> {
    return this.axiosCall<Post>({
      method: 'GET',
      url: `/posts/${id}`
    })
  }

  async createPost(postData: Post): ServiceResponseType<Post> {
    const formData = new FormData()
  
    formData.append('title', postData.title)
    formData.append('content', postData.content)
    formData.append('type', postData.type)
    formData.append('area', postData.area)
    formData.append('date', postData.date)
    formData.append('time', postData.time)
    formData.append('eventdate', postData.eventdate || '')
  
    postData.image.forEach((image, index) => {
      if (image instanceof File) {
        formData.append(`image[${index}]`, image);
      } else if (typeof image === 'string') {
        // Если изображение уже загружено и это URL, можно отправить как строку
        formData.append(`image[${index}]`, image);
      }
    });
  
    return this.axiosCall<Post>({
      method: 'POST',
      url: '/posts',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
  
  async updatePost(id: number, postData: Partial<Post>): ServiceResponseType<Post> {
    const formData = new FormData()
  
    if (postData.title) formData.append('title', postData.title)
    if (postData.content) formData.append('content', postData.content)
    if (postData.type) formData.append('type', postData.type)
    if (postData.area) formData.append('area', postData.area)
    if (postData.date) formData.append('date', postData.date)
    if (postData.time) formData.append('time', postData.time)
    if (postData.eventdate) formData.append('eventdate', postData.eventdate)
  
    if (postData.image) {
      postData.image.forEach((image, index) => {
        formData.append(`image[${index}]`, image)
      })
    }
  
    return this.axiosCall<Post>({
      method: 'PUT',
      url: `/posts/${id}`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  async deletePost(id: number): ServiceResponseType<void> {
    return this.axiosCall<void>({
      method: 'DELETE',
      url: `/posts/${id}`
    })
  }
 
  async registerUserForEvent(postId: number): Promise<void> {
    try {
      const [authError, isAuthorized] = await authService.check()

      if (authError || !isAuthorized) {
        ElNotification({
          title: 'Ошибка',
          message: 'Вы не авторизованы. Пожалуйста, войдите в систему.',
          type: 'error',
          position: 'bottom-right'
        })

        return
      }

      const [error, userResponse] = await this.axiosCall({
        method: 'GET',
        url: '/user/info'
      })

      if (error) {
        ElNotification({
          title: 'Ошибка',
          message: 'Не удалось получить информацию о пользователе!',
          type: 'error',
          position: 'bottom-right'
        })

        return
      }

      const userId = userResponse?.data?.id

      const [isRegisteredError, isRegisteredResponse] = await this.axiosCall({
        method: 'GET',
        url: `/event/is-registered?userId=${userId}&postId=${postId}`,
      })

      if (isRegisteredError) {
        ElNotification({
          title: 'Ошибка',
          message: 'Не удалось зарегистрироваться на мероприятие!',
          type: 'error',
          position: 'bottom-right'
        })

        return
      }

      if (isRegisteredResponse?.data?.isRegistered) {
        ElNotification({
          title: 'Информация',
          message: 'Вы уже зарегистрированы на это мероприятие.',
          type: 'info',
          position: 'bottom-right',
        });
        return;
      }
  
      // Регистрируем пользователя
      const [registerError] = await this.axiosCall({
        method: 'POST',
        url: '/event/register',
        data: {
          userId,
          postId,
        },
      });
  
      if (registerError) {
        ElNotification({
          title: 'Ошибка',
          message: 'Не удалось зарегистрироваться на мероприятие!',
          type: 'error',
          position: 'bottom-right',
        });
        return;
      }
  
      ElNotification({
        title: 'Успех',
        message: 'Вы успешно зарегистрированы на мероприятие!',
        type: 'success',
        position: 'bottom-right',
      });
    } catch (error) {
      console.error(error);
      
      ElNotification({
        title: 'Ошибка',
        message: 'Произошла ошибка при регистрации!',
        type: 'error',
        position: 'bottom-right',
      });
    }
  }

}

export const postService = new PostService()
export { Post }

