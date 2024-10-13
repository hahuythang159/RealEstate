using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RealEstateApi.Migrations
{
    /// <inheritdoc />
    public partial class UpgradeProeperty2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Provinces",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100);

            migrationBuilder.AddColumn<int>(
                name: "ProvinceId1",
                table: "Properties",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Properties_ProvinceId1",
                table: "Properties",
                column: "ProvinceId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Properties_Provinces_ProvinceId1",
                table: "Properties",
                column: "ProvinceId1",
                principalTable: "Provinces",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Properties_Provinces_ProvinceId1",
                table: "Properties");

            migrationBuilder.DropIndex(
                name: "IX_Properties_ProvinceId1",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "ProvinceId1",
                table: "Properties");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Provinces",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(100)",
                oldMaxLength: 100,
                oldNullable: true);
        }
    }
}
