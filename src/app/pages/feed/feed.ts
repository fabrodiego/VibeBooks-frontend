import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedService } from '../../services/feed';
import { BookFeedDTO } from '../../interfaces/api-dtos';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feed.html',
  styleUrl: './feed.scss'
})
export class FeedComponent implements OnInit {
  private feedService = inject(FeedService);

  feedItems = signal<BookFeedDTO[]>([]);
  isLoading = signal(true);
  currentPage = signal(0);
  totalPages = signal(0);

  ngOnInit(): void {
    this.loadFeed();
  }

  loadFeed(page = 0): void {
    this.isLoading.set(true);
    this.feedService.getFeed(page, 10).subscribe({
      next: (response) => {
        this.feedItems.set(response.content);
        this.currentPage.set(response.currentPage);
        this.totalPages.set(response.totalPages);
        this.isLoading.set(false);
        console.log('Feed data loaded:', response);
      },
      error: (err) => {
        console.error('Failed to load feed', err);
        this.isLoading.set(false);
      }
    });
  }
}
