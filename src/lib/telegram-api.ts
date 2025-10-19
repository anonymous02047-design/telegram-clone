import axios, { AxiosInstance, AxiosResponse } from 'axios';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

export interface TelegramChat {
  id: number;
  type: 'private' | 'group' | 'supergroup' | 'channel';
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  photo?: {
    small_file_id: string;
    big_file_id: string;
  };
  description?: string;
  invite_link?: string;
  pinned_message?: TelegramMessage;
  permissions?: TelegramChatPermissions;
  slow_mode_delay?: number;
  message_auto_delete_time?: number;
  has_aggressive_anti_spam_enabled?: boolean;
  has_hidden_members?: boolean;
  has_protected_content?: boolean;
  join_to_send_messages?: boolean;
  join_by_request?: boolean;
  has_restricted_voice_and_video_messages?: boolean;
  is_forum?: boolean;
  active_usernames?: string[];
  emoji_status_custom_emoji_id?: string;
  bio?: string;
  has_private_forwards?: boolean;
  has_public_forwards?: boolean;
  has_visible_history?: boolean;
  member_count?: number;
  created_at?: number;
}

export interface TelegramMessage {
  message_id: number;
  from?: TelegramUser;
  sender_chat?: TelegramChat;
  date: number;
  chat: TelegramChat;
  forward_from?: TelegramUser;
  forward_from_chat?: TelegramChat;
  forward_from_message_id?: number;
  forward_signature?: string;
  forward_sender_name?: string;
  forward_date?: number;
  is_automatic_forward?: boolean;
  reply_to_message?: TelegramMessage;
  via_bot?: TelegramUser;
  edit_date?: number;
  has_protected_content?: boolean;
  media_group_id?: string;
  author_signature?: string;
  text?: string;
  entities?: TelegramMessageEntity[];
  caption_entities?: TelegramMessageEntity[];
  audio?: TelegramAudio;
  document?: TelegramDocument;
  photo?: TelegramPhotoSize[];
  sticker?: TelegramSticker;
  video?: TelegramVideo;
  video_note?: TelegramVideoNote;
  voice?: TelegramVoice;
  caption?: string;
  contact?: TelegramContact;
  location?: TelegramLocation;
  venue?: TelegramVenue;
  poll?: TelegramPoll;
  dice?: TelegramDice;
  new_chat_members?: TelegramUser[];
  left_chat_member?: TelegramUser;
  new_chat_title?: string;
  new_chat_photo?: TelegramPhotoSize[];
  delete_chat_photo?: boolean;
  group_chat_created?: boolean;
  supergroup_chat_created?: boolean;
  channel_chat_created?: boolean;
  message_auto_delete_timer_changed?: {
    message_auto_delete_time: number;
  };
  migrate_to_chat_id?: number;
  migrate_from_chat_id?: number;
  pinned_message?: TelegramMessage;
  invoice?: TelegramInvoice;
  successful_payment?: TelegramSuccessfulPayment;
  connected_website?: string;
  passport_data?: TelegramPassportData;
  proximity_alert_triggered?: TelegramProximityAlertTriggered;
  video_chat_scheduled?: TelegramVideoChatScheduled;
  video_chat_started?: TelegramVideoChatStarted;
  video_chat_ended?: TelegramVideoChatEnded;
  video_chat_participants_invited?: TelegramVideoChatParticipantsInvited;
  web_app_data?: TelegramWebAppData;
  reply_markup?: TelegramInlineKeyboardMarkup;
}

export interface TelegramMessageEntity {
  type: 'mention' | 'hashtag' | 'cashtag' | 'bot_command' | 'url' | 'email' | 'phone_number' | 'bold' | 'italic' | 'underline' | 'strikethrough' | 'spoiler' | 'code' | 'pre' | 'text_link' | 'text_mention' | 'custom_emoji';
  offset: number;
  length: number;
  url?: string;
  user?: TelegramUser;
  language?: string;
  custom_emoji_id?: string;
}

export interface TelegramChatPermissions {
  can_send_messages?: boolean;
  can_send_audios?: boolean;
  can_send_documents?: boolean;
  can_send_photos?: boolean;
  can_send_videos?: boolean;
  can_send_video_notes?: boolean;
  can_send_voice_notes?: boolean;
  can_send_polls?: boolean;
  can_send_other_messages?: boolean;
  can_add_web_page_previews?: boolean;
  can_change_info?: boolean;
  can_invite_users?: boolean;
  can_pin_messages?: boolean;
  can_manage_topics?: boolean;
}

export interface TelegramPhotoSize {
  file_id: string;
  file_unique_id: string;
  width: number;
  height: number;
  file_size?: number;
}

export interface TelegramAudio {
  file_id: string;
  file_unique_id: string;
  duration: number;
  performer?: string;
  title?: string;
  mime_type?: string;
  file_size?: number;
  thumbnail?: TelegramPhotoSize;
}

export interface TelegramDocument {
  file_id: string;
  file_unique_id: string;
  thumbnail?: TelegramPhotoSize;
  file_name?: string;
  mime_type?: string;
  file_size?: number;
}

export interface TelegramSticker {
  file_id: string;
  file_unique_id: string;
  type: 'regular' | 'mask' | 'custom_emoji';
  width: number;
  height: number;
  is_animated: boolean;
  is_video: boolean;
  thumbnail?: TelegramPhotoSize;
  emoji?: string;
  set_name?: string;
  premium_animation?: TelegramFile;
  mask_position?: TelegramMaskPosition;
  custom_emoji_id?: string;
  needs_repainting?: boolean;
  file_size?: number;
}

export interface TelegramVideo {
  file_id: string;
  file_unique_id: string;
  width: number;
  height: number;
  duration: number;
  thumbnail?: TelegramPhotoSize;
  mime_type?: string;
  file_size?: number;
}

export interface TelegramVideoNote {
  file_id: string;
  file_unique_id: string;
  length: number;
  duration: number;
  thumbnail?: TelegramPhotoSize;
  file_size?: number;
}

export interface TelegramVoice {
  file_id: string;
  file_unique_id: string;
  duration: number;
  mime_type?: string;
  file_size?: number;
}

export interface TelegramContact {
  phone_number: string;
  first_name: string;
  last_name?: string;
  user_id?: number;
  vcard?: string;
}

export interface TelegramLocation {
  longitude: number;
  latitude: number;
  horizontal_accuracy?: number;
  live_period?: number;
  heading?: number;
  proximity_alert_radius?: number;
}

export interface TelegramVenue {
  location: TelegramLocation;
  title: string;
  address: string;
  foursquare_id?: string;
  foursquare_type?: string;
  google_place_id?: string;
  google_place_type?: string;
}

export interface TelegramPoll {
  id: string;
  question: string;
  options: TelegramPollOption[];
  total_voter_count: number;
  is_closed: boolean;
  is_anonymous: boolean;
  type: 'quiz' | 'regular';
  allows_multiple_answers: boolean;
  correct_option_id?: number;
  explanation?: string;
  explanation_entities?: TelegramMessageEntity[];
  open_period?: number;
  close_date?: number;
}

export interface TelegramPollOption {
  text: string;
  voter_count: number;
}

export interface TelegramDice {
  emoji: string;
  value: number;
}

export interface TelegramInvoice {
  title: string;
  description: string;
  start_parameter: string;
  currency: string;
  total_amount: number;
}

export interface TelegramSuccessfulPayment {
  currency: string;
  total_amount: number;
  invoice_payload: string;
  shipping_option_id?: string;
  order_info?: TelegramOrderInfo;
  telegram_payment_charge_id: string;
  provider_payment_charge_id: string;
}

export interface TelegramOrderInfo {
  name?: string;
  phone_number?: string;
  email?: string;
  shipping_address?: TelegramShippingAddress;
}

export interface TelegramShippingAddress {
  country_code: string;
  state: string;
  city: string;
  street_line1: string;
  street_line2: string;
  post_code: string;
}

export interface TelegramPassportData {
  data: TelegramEncryptedPassportElement[];
  credentials: TelegramEncryptedCredentials;
}

export interface TelegramEncryptedPassportElement {
  type: 'personal_details' | 'passport' | 'driver_license' | 'identity_card' | 'internal_passport' | 'address' | 'utility_bill' | 'bank_statement' | 'rental_agreement' | 'passport_registration' | 'temporary_registration' | 'phone_number' | 'email';
  data?: string;
  phone_number?: string;
  email?: string;
  files?: TelegramPassportFile[];
  front_side?: TelegramPassportFile;
  reverse_side?: TelegramPassportFile;
  selfie?: TelegramPassportFile;
  translation?: TelegramPassportFile[];
  hash: string;
}

export interface TelegramEncryptedCredentials {
  data: string;
  hash: string;
  secret: string;
}

export interface TelegramPassportFile {
  file_id: string;
  file_unique_id: string;
  file_size: number;
  file_date: number;
}

export interface TelegramProximityAlertTriggered {
  traveler: TelegramUser;
  watcher: TelegramUser;
  distance: number;
}

export interface TelegramVideoChatScheduled {
  start_date: number;
}

export interface TelegramVideoChatStarted {
  duration: number;
}

export interface TelegramVideoChatEnded {
  duration: number;
}

export interface TelegramVideoChatParticipantsInvited {
  users: TelegramUser[];
}

export interface TelegramWebAppData {
  data: string;
  button_text: string;
}

export interface TelegramInlineKeyboardMarkup {
  inline_keyboard: TelegramInlineKeyboardButton[][];
}

export interface TelegramInlineKeyboardButton {
  text: string;
  url?: string;
  login_url?: TelegramLoginUrl;
  switch_inline_query?: string;
  switch_inline_query_current_chat?: string;
  switch_inline_query_chosen_chat?: TelegramSwitchInlineQueryChosenChat;
  callback_data?: string;
  web_app?: TelegramWebApp;
  pay?: boolean;
}

export interface TelegramLoginUrl {
  url: string;
  forward_text?: string;
  bot_username?: string;
  request_write_access?: boolean;
}

export interface TelegramSwitchInlineQueryChosenChat {
  query?: string;
  allow_user_chats?: boolean;
  allow_bot_chats?: boolean;
  allow_group_chats?: boolean;
  allow_channel_chats?: boolean;
}

export interface TelegramWebApp {
  url: string;
}

export interface TelegramFile {
  file_id: string;
  file_unique_id: string;
  file_size?: number;
  file_path?: string;
}

export interface TelegramMaskPosition {
  point: 'forehead' | 'eyes' | 'mouth' | 'chin';
  x_shift: number;
  y_shift: number;
  scale: number;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  edited_message?: TelegramMessage;
  channel_post?: TelegramMessage;
  edited_channel_post?: TelegramMessage;
  inline_query?: TelegramInlineQuery;
  chosen_inline_result?: TelegramChosenInlineResult;
  callback_query?: TelegramCallbackQuery;
  shipping_query?: TelegramShippingQuery;
  pre_checkout_query?: TelegramPreCheckoutQuery;
  poll?: TelegramPoll;
  poll_answer?: TelegramPollAnswer;
  my_chat_member?: TelegramChatMemberUpdated;
  chat_member?: TelegramChatMemberUpdated;
  chat_join_request?: TelegramChatJoinRequest;
}

export interface TelegramInlineQuery {
  id: string;
  from: TelegramUser;
  query: string;
  offset: string;
  chat_type?: 'sender' | 'private' | 'group' | 'supergroup' | 'channel';
  location?: TelegramLocation;
}

export interface TelegramChosenInlineResult {
  result_id: string;
  from: TelegramUser;
  location?: TelegramLocation;
  inline_message_id?: string;
  query: string;
}

export interface TelegramCallbackQuery {
  id: string;
  from: TelegramUser;
  message?: TelegramMessage;
  inline_message_id?: string;
  chat_instance: string;
  data?: string;
  game_short_name?: string;
}

export interface TelegramShippingQuery {
  id: string;
  from: TelegramUser;
  invoice_payload: string;
  shipping_address: TelegramShippingAddress;
}

export interface TelegramPreCheckoutQuery {
  id: string;
  from: TelegramUser;
  currency: string;
  total_amount: number;
  invoice_payload: string;
  shipping_option_id?: string;
  order_info?: TelegramOrderInfo;
}

export interface TelegramPollAnswer {
  poll_id: string;
  user: TelegramUser;
  option_ids: number[];
}

export interface TelegramChatMemberUpdated {
  chat: TelegramChat;
  from: TelegramUser;
  date: number;
  old_chat_member: TelegramChatMember;
  new_chat_member: TelegramChatMember;
  invite_link?: TelegramChatInviteLink;
}

export interface TelegramChatMember {
  status: 'creator' | 'administrator' | 'member' | 'restricted' | 'left' | 'kicked';
  user: TelegramUser;
  is_anonymous?: boolean;
  custom_title?: string;
  is_member?: boolean;
  can_be_edited?: boolean;
  can_manage_chat?: boolean;
  can_delete_messages?: boolean;
  can_manage_video_chats?: boolean;
  can_restrict_members?: boolean;
  can_promote_members?: boolean;
  can_change_info?: boolean;
  can_invite_users?: boolean;
  can_post_messages?: boolean;
  can_edit_messages?: boolean;
  can_pin_messages?: boolean;
  can_manage_topics?: boolean;
  can_post_stories?: boolean;
  can_edit_stories?: boolean;
  can_delete_stories?: boolean;
  until_date?: number;
  can_send_messages?: boolean;
  can_send_audios?: boolean;
  can_send_documents?: boolean;
  can_send_photos?: boolean;
  can_send_videos?: boolean;
  can_send_video_notes?: boolean;
  can_send_voice_notes?: boolean;
  can_send_polls?: boolean;
  can_send_other_messages?: boolean;
  can_add_web_page_previews?: boolean;
}

export interface TelegramChatJoinRequest {
  chat: TelegramChat;
  from: TelegramUser;
  date: number;
  bio?: string;
  invite_link?: TelegramChatInviteLink;
}

export interface TelegramChatInviteLink {
  invite_link: string;
  creator: TelegramUser;
  creates_join_request: boolean;
  is_primary: boolean;
  is_revoked: boolean;
  name?: string;
  expire_date?: number;
  member_limit?: number;
  pending_join_request_count?: number;
}

export interface TelegramApiResponse<T = unknown> {
  ok: boolean;
  result: T;
  description?: string;
  error_code?: number;
  parameters?: {
    migrate_to_chat_id?: number;
    retry_after?: number;
  };
}

class TelegramApiService {
  private api: AxiosInstance;
  private botToken: string;
  private baseUrl: string;

  constructor(botToken: string) {
    this.botToken = botToken;
    this.baseUrl = `https://api.telegram.org/bot${botToken}`;
    
    this.api = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        console.log(`[Telegram API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[Telegram API] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse<TelegramApiResponse>) => {
        if (!response.data.ok) {
          throw new Error(`Telegram API Error: ${response.data.description || 'Unknown error'}`);
        }
        return response;
      },
      (error) => {
        console.error('[Telegram API] Response error:', error);
        if (error.response?.data?.description) {
          throw new Error(`Telegram API Error: ${error.response.data.description}`);
        }
        throw error;
      }
    );
  }

  // Get bot information
  async getMe(): Promise<TelegramUser> {
    const response = await this.api.get('/getMe');
    return response.data.result;
  }

  // Get updates (webhook or polling)
  async getUpdates(offset?: number, limit?: number, timeout?: number, allowed_updates?: string[]): Promise<TelegramUpdate[]> {
    const response = await this.api.post('/getUpdates', {
      offset,
      limit,
      timeout,
      allowed_updates,
    });
    return response.data.result;
  }

  // Send message
  async sendMessage(
    chatId: number | string,
    text: string,
    options?: {
      parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2';
      entities?: TelegramMessageEntity[];
      disable_web_page_preview?: boolean;
      disable_notification?: boolean;
      protect_content?: boolean;
      reply_to_message_id?: number;
      allow_sending_without_reply?: boolean;
      reply_markup?: TelegramInlineKeyboardMarkup;
    }
  ): Promise<TelegramMessage> {
    const response = await this.api.post('/sendMessage', {
      chat_id: chatId,
      text,
      ...options,
    });
    return response.data.result;
  }

  // Send photo
  async sendPhoto(
    chatId: number | string,
    photo: string | Buffer,
    options?: {
      caption?: string;
      parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2';
      caption_entities?: TelegramMessageEntity[];
      disable_notification?: boolean;
      protect_content?: boolean;
      reply_to_message_id?: number;
      allow_sending_without_reply?: boolean;
      reply_markup?: TelegramInlineKeyboardMarkup;
    }
  ): Promise<TelegramMessage> {
    const formData = new FormData();
    formData.append('chat_id', chatId.toString());
    formData.append('photo', photo);
    
    if (options?.caption) formData.append('caption', options.caption);
    if (options?.parse_mode) formData.append('parse_mode', options.parse_mode);
    if (options?.disable_notification) formData.append('disable_notification', options.disable_notification.toString());
    if (options?.protect_content) formData.append('protect_content', options.protect_content.toString());
    if (options?.reply_to_message_id) formData.append('reply_to_message_id', options.reply_to_message_id.toString());
    if (options?.allow_sending_without_reply) formData.append('allow_sending_without_reply', options.allow_sending_without_reply.toString());
    if (options?.reply_markup) formData.append('reply_markup', JSON.stringify(options.reply_markup));

    const response = await this.api.post('/sendPhoto', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.result;
  }

  // Send document
  async sendDocument(
    chatId: number | string,
    document: string | Buffer,
    options?: {
      caption?: string;
      parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2';
      caption_entities?: TelegramMessageEntity[];
      disable_content_type_detection?: boolean;
      disable_notification?: boolean;
      protect_content?: boolean;
      reply_to_message_id?: number;
      allow_sending_without_reply?: boolean;
      reply_markup?: TelegramInlineKeyboardMarkup;
    }
  ): Promise<TelegramMessage> {
    const formData = new FormData();
    formData.append('chat_id', chatId.toString());
    formData.append('document', document);
    
    if (options?.caption) formData.append('caption', options.caption);
    if (options?.parse_mode) formData.append('parse_mode', options.parse_mode);
    if (options?.disable_content_type_detection) formData.append('disable_content_type_detection', options.disable_content_type_detection.toString());
    if (options?.disable_notification) formData.append('disable_notification', options.disable_notification.toString());
    if (options?.protect_content) formData.append('protect_content', options.protect_content.toString());
    if (options?.reply_to_message_id) formData.append('reply_to_message_id', options.reply_to_message_id.toString());
    if (options?.allow_sending_without_reply) formData.append('allow_sending_without_reply', options.allow_sending_without_reply.toString());
    if (options?.reply_markup) formData.append('reply_markup', JSON.stringify(options.reply_markup));

    const response = await this.api.post('/sendDocument', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.result;
  }

  // Send voice message
  async sendVoice(
    chatId: number | string,
    voice: string | Buffer,
    options?: {
      caption?: string;
      parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2';
      caption_entities?: TelegramMessageEntity[];
      duration?: number;
      disable_notification?: boolean;
      protect_content?: boolean;
      reply_to_message_id?: number;
      allow_sending_without_reply?: boolean;
      reply_markup?: TelegramInlineKeyboardMarkup;
    }
  ): Promise<TelegramMessage> {
    const formData = new FormData();
    formData.append('chat_id', chatId.toString());
    formData.append('voice', voice);
    
    if (options?.caption) formData.append('caption', options.caption);
    if (options?.parse_mode) formData.append('parse_mode', options.parse_mode);
    if (options?.duration) formData.append('duration', options.duration.toString());
    if (options?.disable_notification) formData.append('disable_notification', options.disable_notification.toString());
    if (options?.protect_content) formData.append('protect_content', options.protect_content.toString());
    if (options?.reply_to_message_id) formData.append('reply_to_message_id', options.reply_to_message_id.toString());
    if (options?.allow_sending_without_reply) formData.append('allow_sending_without_reply', options.allow_sending_without_reply.toString());
    if (options?.reply_markup) formData.append('reply_markup', JSON.stringify(options.reply_markup));

    const response = await this.api.post('/sendVoice', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.result;
  }

  // Send video
  async sendVideo(
    chatId: number | string,
    video: string | Buffer,
    options?: {
      duration?: number;
      width?: number;
      height?: number;
      thumbnail?: string | Buffer;
      caption?: string;
      parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2';
      caption_entities?: TelegramMessageEntity[];
      supports_streaming?: boolean;
      disable_notification?: boolean;
      protect_content?: boolean;
      reply_to_message_id?: number;
      allow_sending_without_reply?: boolean;
      reply_markup?: TelegramInlineKeyboardMarkup;
    }
  ): Promise<TelegramMessage> {
    const formData = new FormData();
    formData.append('chat_id', chatId.toString());
    formData.append('video', video);
    
    if (options?.duration) formData.append('duration', options.duration.toString());
    if (options?.width) formData.append('width', options.width.toString());
    if (options?.height) formData.append('height', options.height.toString());
    if (options?.thumbnail) formData.append('thumbnail', options.thumbnail);
    if (options?.caption) formData.append('caption', options.caption);
    if (options?.parse_mode) formData.append('parse_mode', options.parse_mode);
    if (options?.supports_streaming) formData.append('supports_streaming', options.supports_streaming.toString());
    if (options?.disable_notification) formData.append('disable_notification', options.disable_notification.toString());
    if (options?.protect_content) formData.append('protect_content', options.protect_content.toString());
    if (options?.reply_to_message_id) formData.append('reply_to_message_id', options.reply_to_message_id.toString());
    if (options?.allow_sending_without_reply) formData.append('allow_sending_without_reply', options.allow_sending_without_reply.toString());
    if (options?.reply_markup) formData.append('reply_markup', JSON.stringify(options.reply_markup));

    const response = await this.api.post('/sendVideo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.result;
  }

  // Edit message
  async editMessageText(
    chatId: number | string,
    messageId: number,
    text: string,
    options?: {
      parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2';
      entities?: TelegramMessageEntity[];
      disable_web_page_preview?: boolean;
      reply_markup?: TelegramInlineKeyboardMarkup;
    }
  ): Promise<TelegramMessage> {
    const response = await this.api.post('/editMessageText', {
      chat_id: chatId,
      message_id: messageId,
      text,
      ...options,
    });
    return response.data.result;
  }

  // Delete message
  async deleteMessage(chatId: number | string, messageId: number): Promise<boolean> {
    const response = await this.api.post('/deleteMessage', {
      chat_id: chatId,
      message_id: messageId,
    });
    return response.data.result;
  }

  // Get chat information
  async getChat(chatId: number | string): Promise<TelegramChat> {
    const response = await this.api.post('/getChat', {
      chat_id: chatId,
    });
    return response.data.result;
  }

  // Get chat members
  async getChatMembersCount(chatId: number | string): Promise<number> {
    const response = await this.api.post('/getChatMembersCount', {
      chat_id: chatId,
    });
    return response.data.result;
  }

  // Get chat member
  async getChatMember(chatId: number | string, userId: number): Promise<TelegramChatMember> {
    const response = await this.api.post('/getChatMember', {
      chat_id: chatId,
      user_id: userId,
    });
    return response.data.result;
  }

  // Set webhook
  async setWebhook(
    url: string,
    options?: {
      certificate?: string | Buffer;
      ip_address?: string;
      max_connections?: number;
      allowed_updates?: string[];
      drop_pending_updates?: boolean;
      secret_token?: string;
    }
  ): Promise<boolean> {
    const response = await this.api.post('/setWebhook', {
      url,
      ...options,
    });
    return response.data.result;
  }

  // Delete webhook
  async deleteWebhook(drop_pending_updates?: boolean): Promise<boolean> {
    const response = await this.api.post('/deleteWebhook', {
      drop_pending_updates,
    });
    return response.data.result;
  }

  // Get webhook info
  async getWebhookInfo(): Promise<{
    url: string;
    has_custom_certificate: boolean;
    pending_update_count: number;
    ip_address?: string;
    last_error_date?: number;
    last_error_message?: string;
    max_connections?: number;
    allowed_updates?: string[];
  }> {
    const response = await this.api.get('/getWebhookInfo');
    return response.data.result;
  }

  // Answer callback query
  async answerCallbackQuery(
    callbackQueryId: string,
    options?: {
      text?: string;
      show_alert?: boolean;
      url?: string;
      cache_time?: number;
    }
  ): Promise<boolean> {
    const response = await this.api.post('/answerCallbackQuery', {
      callback_query_id: callbackQueryId,
      ...options,
    });
    return response.data.result;
  }

  // Set chat permissions
  async setChatPermissions(
    chatId: number | string,
    permissions: TelegramChatPermissions
  ): Promise<boolean> {
    const response = await this.api.post('/setChatPermissions', {
      chat_id: chatId,
      permissions,
    });
    return response.data.result;
  }

  // Promote chat member
  async promoteChatMember(
    chatId: number | string,
    userId: number,
    options?: {
      is_anonymous?: boolean;
      can_manage_chat?: boolean;
      can_delete_messages?: boolean;
      can_manage_video_chats?: boolean;
      can_restrict_members?: boolean;
      can_promote_members?: boolean;
      can_change_info?: boolean;
      can_invite_users?: boolean;
      can_post_messages?: boolean;
      can_edit_messages?: boolean;
      can_pin_messages?: boolean;
      can_manage_topics?: boolean;
    }
  ): Promise<boolean> {
    const response = await this.api.post('/promoteChatMember', {
      chat_id: chatId,
      user_id: userId,
      ...options,
    });
    return response.data.result;
  }

  // Restrict chat member
  async restrictChatMember(
    chatId: number | string,
    userId: number,
    permissions: TelegramChatPermissions,
    until_date?: number
  ): Promise<boolean> {
    const response = await this.api.post('/restrictChatMember', {
      chat_id: chatId,
      user_id: userId,
      permissions,
      until_date,
    });
    return response.data.result;
  }

  // Kick chat member
  async kickChatMember(
    chatId: number | string,
    userId: number,
    until_date?: number
  ): Promise<boolean> {
    const response = await this.api.post('/kickChatMember', {
      chat_id: chatId,
      user_id: userId,
      until_date,
    });
    return response.data.result;
  }

  // Unban chat member
  async unbanChatMember(
    chatId: number | string,
    userId: number,
    only_if_banned?: boolean
  ): Promise<boolean> {
    const response = await this.api.post('/unbanChatMember', {
      chat_id: chatId,
      user_id: userId,
      only_if_banned,
    });
    return response.data.result;
  }

  // Create chat invite link
  async createChatInviteLink(
    chatId: number | string,
    options?: {
      name?: string;
      expire_date?: number;
      member_limit?: number;
      creates_join_request?: boolean;
    }
  ): Promise<TelegramChatInviteLink> {
    const response = await this.api.post('/createChatInviteLink', {
      chat_id: chatId,
      ...options,
    });
    return response.data.result;
  }

  // Revoke chat invite link
  async revokeChatInviteLink(
    chatId: number | string,
    inviteLink: string
  ): Promise<TelegramChatInviteLink> {
    const response = await this.api.post('/revokeChatInviteLink', {
      chat_id: chatId,
      invite_link: inviteLink,
    });
    return response.data.result;
  }

  // Get file
  async getFile(fileId: string): Promise<TelegramFile> {
    const response = await this.api.post('/getFile', {
      file_id: fileId,
    });
    return response.data.result;
  }

  // Download file
  async downloadFile(filePath: string): Promise<Buffer> {
    const response = await axios.get(`https://api.telegram.org/file/bot${this.botToken}/${filePath}`, {
      responseType: 'arraybuffer',
    });
    return Buffer.from(response.data);
  }
}

// Create and export a singleton instance
export const telegramApi = new TelegramApiService(process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN || '');

// Export the class for custom instances
export { TelegramApiService };
