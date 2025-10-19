'use client';

import { TelegramUser } from './telegram-api';

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    query_id?: string;
    user?: TelegramUser;
    auth_date?: number;
    hash?: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: {
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
    hint_color?: string;
    bg_color?: string;
    text_color?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  BackButton: {
    isVisible: boolean;
    show(): void;
    hide(): void;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText(text: string): void;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
    show(): void;
    hide(): void;
    enable(): void;
    disable(): void;
    showProgress(leaveActive?: boolean): void;
    hideProgress(): void;
    setParams(params: {
      text?: string;
      color?: string;
      text_color?: string;
      is_active?: boolean;
      is_visible?: boolean;
    }): void;
  };
  HapticFeedback: {
    impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void;
    notificationOccurred(type: 'error' | 'success' | 'warning'): void;
    selectionChanged(): void;
  };
  CloudStorage: {
    setItem(key: string, value: string, callback?: (error: string | null, result?: boolean) => void): void;
    getItem(key: string, callback: (error: string | null, result?: string) => void): void;
    getItems(keys: string[], callback: (error: string | null, result?: Record<string, string>) => void): void;
    removeItem(key: string, callback?: (error: string | null, result?: boolean) => void): void;
    removeItems(keys: string[], callback?: (error: string | null, result?: boolean) => void): void;
    getKeys(callback: (error: string | null, result?: string[]) => void): void;
  };
  BiometricManager: {
    isInited: boolean;
    isBiometricAvailable: boolean;
    biometricType: 'finger' | 'face' | 'unknown';
    isAccessRequested: boolean;
    isAccessGranted: boolean;
    isBiometricTokenSaved: boolean;
    init(): Promise<boolean>;
    requestAccess(params: {
      reason?: string;
    }): Promise<boolean>;
    authenticate(params: {
      reason?: string;
    }): Promise<boolean>;
    updateBiometricToken(token: string, callback?: (error: string | null, result?: boolean) => void): void;
    openSettings(): void;
  };
  isVersionAtLeast(version: string): boolean;
  setHeaderColor(color: string): void;
  setBackgroundColor(color: string): void;
  enableClosingConfirmation(): void;
  disableClosingConfirmation(): void;
  onEvent(eventType: string, eventHandler: () => void): void;
  offEvent(eventType: string, eventHandler: () => void): void;
  sendData(data: string): void;
  switchInlineQuery(query: string, choose_chat_types?: string[]): void;
  openLink(url: string, options?: {
    try_instant_view?: boolean;
  }): void;
  openTelegramLink(url: string): void;
  openInvoice(url: string, callback?: (status: string) => void): void;
  showPopup(params: {
    title?: string;
    message: string;
    buttons?: Array<{
      id?: string;
      type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
      text?: string;
    }>;
  }, callback?: (buttonId: string) => void): void;
  showAlert(message: string, callback?: () => void): void;
  showConfirm(message: string, callback?: (confirmed: boolean) => void): void;
  showScanQrPopup(params: {
    text?: string;
  }, callback?: (text: string) => void): void;
  closeScanQrPopup(): void;
  readTextFromClipboard(callback?: (text: string) => void): void;
  requestWriteAccess(callback?: (granted: boolean) => void): void;
  requestContact(callback?: (granted: boolean) => void): void;
  ready(): void;
  expand(): void;
  close(): void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

class TelegramWebAppService {
  private webApp: TelegramWebApp | null = null;
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      this.webApp = window.Telegram.WebApp;
      this.isInitialized = true;
      
      // Configure the WebApp
      this.webApp.ready();
      this.webApp.expand();
      
      console.log('Telegram WebApp initialized');
    } else {
      console.warn('Telegram WebApp not available - running in development mode');
    }
  }

  get isAvailable(): boolean {
    return this.isInitialized && this.webApp !== null;
  }

  get user(): TelegramUser | null {
    if (!this.webApp) return null;
    return this.webApp.initDataUnsafe.user || null;
  }

  get initData(): string {
    if (!this.webApp) return '';
    return this.webApp.initData;
  }

  get theme(): 'light' | 'dark' {
    if (!this.webApp) return 'light';
    return this.webApp.colorScheme;
  }

  get themeParams() {
    if (!this.webApp) return {};
    return this.webApp.themeParams;
  }

  get isExpanded(): boolean {
    if (!this.webApp) return true;
    return this.webApp.isExpanded;
  }

  get viewportHeight(): number {
    if (!this.webApp) return window.innerHeight;
    return this.webApp.viewportHeight;
  }

  get viewportStableHeight(): number {
    if (!this.webApp) return window.innerHeight;
    return this.webApp.viewportStableHeight;
  }

  // Back Button
  get backButton() {
    if (!this.webApp) return null;
    return this.webApp.BackButton;
  }

  showBackButton(callback: () => void) {
    if (!this.webApp) return;
    this.webApp.BackButton.onClick(callback);
    this.webApp.BackButton.show();
  }

  hideBackButton() {
    if (!this.webApp) return;
    this.webApp.BackButton.hide();
  }

  // Main Button
  get mainButton() {
    if (!this.webApp) return null;
    return this.webApp.MainButton;
  }

  setMainButton(text: string, callback: () => void, options?: {
    color?: string;
    textColor?: string;
    isActive?: boolean;
  }) {
    if (!this.webApp) return;
    
    this.webApp.MainButton.setText(text);
    this.webApp.MainButton.onClick(callback);
    
    if (options) {
      this.webApp.MainButton.setParams(options);
    }
    
    this.webApp.MainButton.show();
  }

  hideMainButton() {
    if (!this.webApp) return;
    this.webApp.MainButton.hide();
  }

  // Haptic Feedback
  get hapticFeedback() {
    if (!this.webApp) return null;
    return this.webApp.HapticFeedback;
  }

  impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'medium') {
    if (!this.webApp) return;
    this.webApp.HapticFeedback.impactOccurred(style);
  }

  notificationOccurred(type: 'error' | 'success' | 'warning') {
    if (!this.webApp) return;
    this.webApp.HapticFeedback.notificationOccurred(type);
  }

  selectionChanged() {
    if (!this.webApp) return;
    this.webApp.HapticFeedback.selectionChanged();
  }

  // Cloud Storage
  get cloudStorage() {
    if (!this.webApp) return null;
    return this.webApp.CloudStorage;
  }

  setCloudItem(key: string, value: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.webApp) {
        reject(new Error('Telegram WebApp not available'));
        return;
      }
      
      this.webApp.CloudStorage.setItem(key, value, (error, result) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(result || false);
        }
      });
    });
  }

  getCloudItem(key: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      if (!this.webApp) {
        reject(new Error('Telegram WebApp not available'));
        return;
      }
      
      this.webApp.CloudStorage.getItem(key, (error, result) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(result || null);
        }
      });
    });
  }

  // Biometric Manager
  get biometricManager() {
    if (!this.webApp) return null;
    return this.webApp.BiometricManager;
  }

  async initBiometric(): Promise<boolean> {
    if (!this.webApp) return false;
    return await this.webApp.BiometricManager.init();
  }

  async requestBiometricAccess(reason?: string): Promise<boolean> {
    if (!this.webApp) return false;
    return await this.webApp.BiometricManager.requestAccess({ reason });
  }

  async authenticateBiometric(reason?: string): Promise<boolean> {
    if (!this.webApp) return false;
    return await this.webApp.BiometricManager.authenticate({ reason });
  }

  // UI Methods
  setHeaderColor(color: string) {
    if (!this.webApp) return;
    this.webApp.setHeaderColor(color);
  }

  setBackgroundColor(color: string) {
    if (!this.webApp) return;
    this.webApp.setBackgroundColor(color);
  }

  enableClosingConfirmation() {
    if (!this.webApp) return;
    this.webApp.enableClosingConfirmation();
  }

  disableClosingConfirmation() {
    if (!this.webApp) return;
    this.webApp.disableClosingConfirmation();
  }

  // Navigation
  openLink(url: string, options?: { try_instant_view?: boolean }) {
    if (!this.webApp) {
      window.open(url, '_blank');
      return;
    }
    this.webApp.openLink(url, options);
  }

  openTelegramLink(url: string) {
    if (!this.webApp) return;
    this.webApp.openTelegramLink(url);
  }

  switchInlineQuery(query: string, choose_chat_types?: string[]) {
    if (!this.webApp) return;
    this.webApp.switchInlineQuery(query, choose_chat_types);
  }

  // Popups
  showPopup(params: {
    title?: string;
    message: string;
    buttons?: Array<{
      id?: string;
      type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
      text?: string;
    }>;
  }): Promise<string | null> {
    return new Promise((resolve) => {
      if (!this.webApp) {
        const result = confirm(params.message);
        resolve(result ? 'ok' : 'cancel');
        return;
      }
      
      this.webApp.showPopup(params, (buttonId) => {
        resolve(buttonId);
      });
    });
  }

  showAlert(message: string): Promise<void> {
    return new Promise((resolve) => {
      if (!this.webApp) {
        alert(message);
        resolve();
        return;
      }
      
      this.webApp.showAlert(message, () => {
        resolve();
      });
    });
  }

  showConfirm(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.webApp) {
        const result = confirm(message);
        resolve(result);
        return;
      }
      
      this.webApp.showConfirm(message, (confirmed) => {
        resolve(confirmed);
      });
    });
  }

  // QR Code Scanner
  showScanQrPopup(params: { text?: string }): Promise<string | null> {
    return new Promise((resolve) => {
      if (!this.webApp) {
        resolve(null);
        return;
      }
      
      this.webApp.showScanQrPopup(params, (text) => {
        resolve(text);
      });
    });
  }

  closeScanQrPopup() {
    if (!this.webApp) return;
    this.webApp.closeScanQrPopup();
  }

  // Clipboard
  readTextFromClipboard(): Promise<string | null> {
    return new Promise((resolve) => {
      if (!this.webApp) {
        if (navigator.clipboard) {
          navigator.clipboard.readText().then(resolve).catch(() => resolve(null));
        } else {
          resolve(null);
        }
        return;
      }
      
      this.webApp.readTextFromClipboard((text) => {
        resolve(text);
      });
    });
  }

  // Permissions
  requestWriteAccess(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.webApp) {
        resolve(true);
        return;
      }
      
      this.webApp.requestWriteAccess((granted) => {
        resolve(granted);
      });
    });
  }

  requestContact(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.webApp) {
        resolve(true);
        return;
      }
      
      this.webApp.requestContact((granted) => {
        resolve(granted);
      });
    });
  }

  // Events
  onEvent(eventType: string, eventHandler: () => void) {
    if (!this.webApp) return;
    this.webApp.onEvent(eventType, eventHandler);
  }

  offEvent(eventType: string, eventHandler: () => void) {
    if (!this.webApp) return;
    this.webApp.offEvent(eventType, eventHandler);
  }

  // Data sending
  sendData(data: string) {
    if (!this.webApp) return;
    this.webApp.sendData(data);
  }

  // Version check
  isVersionAtLeast(version: string): boolean {
    if (!this.webApp) return false;
    return this.webApp.isVersionAtLeast(version);
  }

  // Close app
  close() {
    if (!this.webApp) return;
    this.webApp.close();
  }
}

// Create and export a singleton instance
export const telegramWebApp = new TelegramWebAppService();

// Export the class for custom instances
export { TelegramWebAppService };
export type { TelegramWebApp };
