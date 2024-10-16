﻿using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using RealEstateApi.Models;




public class RealEstateContext : DbContext
    {
        public RealEstateContext(DbContextOptions<RealEstateContext> options)
            : base(options)
        {
        }

        public DbSet<Property> Properties { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Rental> Rentals { get; set; }
        public DbSet<Favorite> Favorites { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Comment> Comments { get; set; } 
        public DbSet<District> Districts { get; set; } 
        public DbSet<Province> Provinces { get; set; } 
        public DbSet<Ward> Wards { get; set; }  



    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Property>()
        .Property(p => p.Price)
        .HasPrecision(18, 2); // Độ chính xác 18 chữ số, 2 chữ số thập phân

    modelBuilder.Entity<Property>()
        .HasOne(p => p.Province)
        .WithMany()
        .HasForeignKey(p => p.ProvinceId)
        .OnDelete(DeleteBehavior.Restrict);

    modelBuilder.Entity<Property>()
        .HasOne(p => p.District)
        .WithMany(d => d.Properties) // District có nhiều Property
        .HasForeignKey(p => p.DistrictId)
        .OnDelete(DeleteBehavior.Restrict);

    modelBuilder.Entity<Property>()
        .HasOne(p => p.Ward)
        .WithMany(w => w.Properties) // Ward có nhiều Property
        .HasForeignKey(p => p.WardId)
        .OnDelete(DeleteBehavior.Restrict);

    modelBuilder.Entity<District>()
        .HasOne(d => d.Province)
        .WithMany(p => p.Districts) // Province có nhiều District
        .HasForeignKey(p => p.ProvinceId) // Định nghĩa rõ khóa ngoại
        .OnDelete(DeleteBehavior.Restrict);

    modelBuilder.Entity<Ward>()
        .HasOne(w => w.District)
        .WithMany(d => d.Wards) // District có nhiều Ward
        .HasForeignKey(w => w.DistrictId)
        .OnDelete(DeleteBehavior.Restrict);    
    }
}

